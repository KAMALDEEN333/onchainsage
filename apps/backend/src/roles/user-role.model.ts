// UserRole mapping for systems
export interface UserRole {
  user_id: string; // user identifier
  role_id: number; // role id
  assigned_at: Date;
  expires_at?: Date; // For time-based permissions
  is_temporary?: boolean;
}
