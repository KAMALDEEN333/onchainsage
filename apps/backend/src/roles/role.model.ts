// Role model for access control system
export type PermissionBitmask = bigint; // u256

export interface Role {
  role_id: number; // u32
  role_name: string; // felt252
  permissions: PermissionBitmask; // u256 bitmasks
  min_reputation_required: bigint; // u256
  parent_role_id?: number; // For permission inheritances
  multi_sig_required?: number; // Number of approvals neededs for critical ops
  audit_log?: string[]; // Audit log for permissions changes with strings
  emergency_controls?: {
    enabled: boolean; // Whether emergency controls are active
    activated_by?: string; // User who activated emergency
    activated_at?: Date;    // Timestamp when emergency was activated
  };
}
