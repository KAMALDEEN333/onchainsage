// Role model for access control system
export type PermissionBitmask = bigint; // u256

export interface Role {
  role_id: number; // u32
  role_name: string; // felt252
  permissions: PermissionBitmask; // u256 bitmask
  min_reputation_required: bigint; // u256
  parent_role_id?: number; // For permission inheritance
  multi_sig_required?: number; // Number of approvals needed for critical ops
  audit_log?: string[]; // Audit log for permission changes
  emergency_controls?: {
    enabled: boolean;
    activated_by?: string;
    activated_at?: Date;
  };
}
