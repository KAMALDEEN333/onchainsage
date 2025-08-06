import { TierLevel } from './tier-level.enum';

export interface Subscription {
  user_address: string; // felt252
  tier_level: TierLevel;
  start_date: bigint; // u64
  end_date: bigint; // u64
  is_active: boolean;
  usage_limit: number; // u32
  current_usage: number; // u32
  grace_period_end?: bigint; // u64, optional
}
