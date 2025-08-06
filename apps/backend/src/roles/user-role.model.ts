// UserRole mapping system
export interface UserRole {
  user_id: string;
  role_id: number;
  assigned_at: Date;
  expires_at?: Date; // For time-based permissions
  is_temporary?: boolean;
}
