// Service for role-based access controls
import { Role, PermissionBitmask } from './role.model';
import { UserRole } from './user-role.model';

export class RolesService {
  private roles: Role[] = [];
  private userRoles: UserRole[] = [];
  private permissionChangeLog: any[] = [];
  private emergencyActive = false;

  // Assign role to user
  assignRole(user_id: string, role_id: number, expires_at?: Date): void {
    this.userRoles.push({ user_id, role_id, assigned_at: new Date(), expires_at, is_temporary: !!expires_at });
    this.logPermissionChange('assign', user_id, role_id);
  }

  // Revoke role from user
  revokeRole(user_id: string, role_id: number): void {
    this.userRoles = this.userRoles.filter(ur => !(ur.user_id === user_id && ur.role_id === role_id));
    this.logPermissionChange('revoke', user_id, role_id);
  }

  // Check if user has permission
  hasPermission(user_id: string, permission: PermissionBitmask): boolean {
    if (this.emergencyActive) return true; // Emergency override
    const now = new Date();
    const userRoles = this.userRoles.filter(ur => ur.user_id === user_id && (!ur.expires_at || ur.expires_at > now));
    for (const ur of userRoles) {
      const role = this.roles.find(r => r.role_id === ur.role_id);
      if (role && (role.permissions & permission) === permission) {
        return true;
      }
    }
    return false;
  }

  // Activate emergency controls
  activateEmergency(): void {
    this.emergencyActive = true;
    this.logPermissionChange('emergency_activate', null, null);
  }

  // Deactivate emergency controls
  deactivateEmergency(): void {
    this.emergencyActive = false;
    this.logPermissionChange('emergency_deactivate', null, null);
  }

  // Log permission changes
  private logPermissionChange(action: string, user_id: string | null, role_id: number | null): void {
    this.permissionChangeLog.push({ action, user_id, role_id, timestamp: new Date() });
  }

  // Admin role management
  isAdmin(user_id: string): boolean {
    return this.hasPermission(user_id, BigInt(1)); // Example: permission bit 1 is admin
  }

  // Time-based permission expiration
  cleanupExpiredRoles(): void {
    const now = new Date();
    this.userRoles = this.userRoles.filter(ur => !ur.expires_at || ur.expires_at > now);
  }

  // Permission inheritance (simple example)
  inheritPermissions(parentRoleId: number, childRoleId: number): void {
    const parent = this.roles.find(r => r.role_id === parentRoleId);
    const child = this.roles.find(r => r.role_id === childRoleId);
    if (parent && child) {
      child.permissions = child.permissions | parent.permissions;
      this.logPermissionChange('inherit', null, childRoleId);
    }
  }

  // Multi-signature requirements for critical operations
  multiSigApprove(user_ids: string[], required: number): boolean {
    let approvals = 0;
    for (const user_id of user_ids) {
      if (this.isAdmin(user_id)) approvals++;
    }
    return approvals >= required;
  }
}
