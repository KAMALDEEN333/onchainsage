// Role model for access control system
export type PermissionBitmask = bigint; // u256

export interface Role {
  role_id: number; // u32
  role_name: string; // felt252
  permissions: PermissionBitmask; // u256 bitmask
  min_reputation_required: bigint; // u256
}
