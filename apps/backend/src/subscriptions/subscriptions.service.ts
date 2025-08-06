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

  // Activate subscription
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
    return sub;
  }

  // Deactivate subscription
  deactivateSubscription(user_address: string): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address && s.is_active);
    if (sub) {
      sub.is_active = false;
      return true;
    }
    return false;
  }

  // Track usage and enforce limits
  incrementUsage(user_address: string, amount: number = 1): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address && s.is_active);
    if (sub && sub.current_usage + amount <= sub.usage_limit) {
      sub.current_usage += amount;
      return true;
    }
    return false;
  }

  // Automatic renewal
  renewSubscription(user_address: string, durationDays: number): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address);
    if (sub && !sub.is_active && BigInt(Date.now()) < sub.end_date + BigInt(7 * 24 * 60 * 60 * 1000)) { // 7-day grace
      sub.start_date = BigInt(Date.now());
      sub.end_date = sub.start_date + BigInt(durationDays * 24 * 60 * 60 * 1000);
      sub.is_active = true;
      sub.current_usage = 0;
      return true;
    }
    return false;
  }

  // Upgrade/downgrade tier
  changeTier(user_address: string, newTier: TierLevel, newLimit: number): boolean {
    const sub = this.subscriptions.find(s => s.user_address === user_address && s.is_active);
    if (sub) {
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
      return true;
    }
    return false;
  }

  // Bulk management for enterprises
  bulkActivate(addresses: string[], tier: TierLevel, usage_limit: number, durationDays: number): Subscription[] {
    return addresses.map(addr => this.activateSubscription(addr, tier, usage_limit, durationDays));
  }

  // Get tier benefits
  getTierBenefits(tier: TierLevel): string[] {
    return this.tierBenefits[tier] || [];
  }
}
