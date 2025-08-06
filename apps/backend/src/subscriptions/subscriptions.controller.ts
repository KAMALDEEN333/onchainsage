import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { TierLevel } from './tier-level.enum';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('activate')
  activate(@Body() body: { user_address: string; tier_level: TierLevel; usage_limit: number; durationDays: number }) {
    return this.subscriptionsService.activateSubscription(body.user_address, body.tier_level, body.usage_limit, body.durationDays);
  }

  @Post('deactivate')
  deactivate(@Body() body: { user_address: string }) {
    return { success: this.subscriptionsService.deactivateSubscription(body.user_address) };
  }

  @Post('usage')
  incrementUsage(@Body() body: { user_address: string; amount?: number }) {
    return { success: this.subscriptionsService.incrementUsage(body.user_address, body.amount || 1) };
  }

  @Post('renew')
  renew(@Body() body: { user_address: string; durationDays: number }) {
    return { success: this.subscriptionsService.renewSubscription(body.user_address, body.durationDays) };
  }

  @Patch('tier')
  changeTier(@Body() body: { user_address: string; newTier: TierLevel; newLimit: number }) {
    return { success: this.subscriptionsService.changeTier(body.user_address, body.newTier, body.newLimit) };
  }

  @Post('grace')
  handleGrace(@Body() body: { user_address: string }) {
    return { success: this.subscriptionsService.handleGracePeriod(body.user_address) };
  }

  @Post('bulk-activate')
  bulkActivate(@Body() body: { addresses: string[]; tier: TierLevel; usage_limit: number; durationDays: number }) {
    return this.subscriptionsService.bulkActivate(body.addresses, body.tier, body.usage_limit, body.durationDays);
  }

  @Get('benefits/:tier')
  getBenefits(@Param('tier') tier: TierLevel) {
    return this.subscriptionsService.getTierBenefits(tier);
  }

  @Get('status/:user_address')
  getStatus(@Param('user_address') user_address: string) {
    return this.subscriptionsService.getSubscriptionStatus(user_address);
  }

  @Get('report/:tier')
  getReport(@Param('tier') tier: TierLevel) {
    return this.subscriptionsService.getSubscriptionsByTier(tier);
  }

  // Get the audit log
  @Get('audit-log')
  getAuditLog() {
    return this.subscriptionsService.getAuditLog();
  }

  // Reset usage for a user
  @Post('reset-usage')
  resetUsage(@Body() body: { user_address: string }) {
    return { success: this.subscriptionsService.resetUsage(body.user_address) };
  }

  // post to cancel subscription
  @Post('cancel')
  cancel(@Body() body: { user_address: string }) {
    return { success: this.subscriptionsService.cancelSubscription(body.user_address) };
  }
}
