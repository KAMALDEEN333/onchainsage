import { Subscription } from './subscription.model';
import { TierLevel } from './tier-level.enum';

export class SubscriptionsService {
  private subscriptions: Subscription[] = [];
  private tierBenefits: Record<TierLevel, string[]> = {
    [TierLevel.FREE]: ['Basic access'],
    [TierLevel.BASIC]: ['Standard access', 'Increased limits'],
    [TierLevel.PREMIUM]: ['Premium features', 'Priority support'],
    [TierLevel.ENTERPRISE]: ['Enterprise features', 'Bulk management', 'Dedicated support'],
  };
  private auditLog: string[] = [];

  // Activate subscriptions
  activateSubscription(user_address: string, tier_level: TierLevel, usage_limit: number, durationDays: number): Subscription {
    const now = BigInt(Date.now());
    const end_date = now + BigInt(durationDays * 24 * 60 * 60 * 1000);
    const sub: Subscription = {
      user_address,
      tier_level,
      start_date: now,
      end_date,
      is_active: true,
      usage_limit,
      current_usage: 0,
    };
    this.subscriptions.push(sub);
    this.logAudit(`Activated subscription for ${user_address} at tier ${TierLevel[tier_level]}`);
    return sub;
  }

  // Deactivate subscription
  deactivateSubscription(user_address: string): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address && s.is_active);
    if (sub) {
      sub.is_active = false;
      this.logAudit(`Deactivated subscription for ${user_address}`);
      return true;
    }
    return false;
  }

  // Track usage and enforce limits
  incrementUsage(user_address: string, amount: number = 1): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address && s.is_active);
    if (sub && sub.current_usage + amount <= sub.usage_limit) {
      sub.current_usage += amount;
      this.logAudit(`Incremented usage for ${user_address} by ${amount}`);
      return true;
    }
    return false;
  }

  // Automatic renewal
  renewSubscription(user_address: string, durationDays: number): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address);
    if (sub && !sub.is_active && BigInt(Date.now()) < sub.end_date + BigInt(7 * 24 * 60 * 60 * 1000)) { // 7-day grace
      // Payment integration stub
      if (!this.processPayment(user_address, sub.tier_level)) {
        this.logAudit(`Payment failed for renewal of ${user_address}`);
        return false;
      }
      sub.start_date = BigInt(Date.now());
      sub.end_date = sub.start_date + BigInt(durationDays * 24 * 60 * 60 * 1000);
      sub.is_active = true;
      sub.current_usage = 0;
      this.logAudit(`Renewed subscription for ${user_address}`);
      return true;
    }
    return false;
  }

  // Upgrade/downgrade tier
  changeTier(user_address: string, newTier: TierLevel, newLimit: number): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address && s.is_active);
    if (sub) {
      this.logAudit(`Changed tier for ${user_address} from ${TierLevel[sub.tier_level]} to ${TierLevel[newTier]}`);
      sub.tier_level = newTier;
      sub.usage_limit = newLimit;
      return true;
    }
    return false;
  }

  // Grace period handling
  handleGracePeriod(user_address: string): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address);
    if (sub && !sub.is_active && BigInt(Date.now()) < sub.end_date + BigInt(7 * 24 * 60 * 60 * 1000)) {
      sub.grace_period_end = sub.end_date + BigInt(7 * 24 * 60 * 60 * 1000);
      this.logAudit(`Grace period set for ${user_address}`);
      return true;
    }
    return false;
  }

  // Bulk management for enterprises
  bulkActivate(addresses: string[], tier: TierLevel, usage_limit: number, durationDays: number): Subscription[] {
    this.logAudit(`Bulk activated ${addresses.length} subscriptions at tier ${TierLevel[tier]}`);
    return addresses.map(addr => this.activateSubscription(addr, tier, usage_limit, durationDays));
  }

  // Get tier benefits
  getTierBenefits(tier: TierLevel): string[] {
    return this.tierBenefits[tier] || [];
  }

  // Reset usage for a subscription (admin/enterprise feature)
  resetUsage(user_address: string): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address);
    if (sub) {
      sub.current_usage = 0;
      this.logAudit(`Usage reset for ${user_address}`);
      return true;
    }
    return false;
  }

  // Cancel subscription (user-initiated)
  cancelSubscription(user_address: string): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address && s.is_active);
    if (sub) {
      sub.is_active = false;
      sub.end_date = BigInt(Date.now());
      this.logAudit(`Subscription cancelled for ${user_address}`);
      return true;
    }
    return false;
  }

  // Query subscription status
  getSubscriptionStatus(user_address: string): Subscription | undefined {
    return this.subscriptions.find(s => s.user_address === user_address);
  }

  // Enterprise reporting: get all subscriptions by tier
  getSubscriptionsByTier(tier: TierLevel): Subscription[] {
    return this.subscriptions.filter(s => s.tier_level === tier);
  }

  // Audit log retrieval
  getAuditLog(): string[] {
    return this.auditLog;
  }

  // Internal: log audit events
  private logAudit(event: string) {
    this.auditLog.push(`${new Date().toISOString()}: ${event}`);
  }

  // Payment integration stub (replace with real handler)
  private processPayment(user_address: string, tier: TierLevel): boolean {
    // TODO: Integrate with STRK Token Payment Handler
    // Return true for now to simulate payment success
    return true;
  }
}
