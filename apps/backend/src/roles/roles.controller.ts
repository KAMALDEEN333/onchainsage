// Controller for role management and access control
import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('assign')
  assignRole(@Body() body: { user_id: string; role_id: number; expires_at?: Date }) {
    this.rolesService.assignRole(body.user_id, body.role_id, body.expires_at);
    return { success: true };
  }

  @Delete('revoke')
  revokeRole(@Body() body: { user_id: string; role_id: number }) {
    this.rolesService.revokeRole(body.user_id, body.role_id);
    return { success: true };
  }

  @Get('emergency/activate')
  activateEmergency() {
    this.rolesService.activateEmergency();
    return { success: true };
  }

  @Get('emergency/deactivate')
  deactivateEmergency() {
    this.rolesService.deactivateEmergency();
    return { success: true };
  }

  @Get('log')
  getPermissionChangeLog() {
    return this.rolesService['permissionChangeLog'];
  }
}
