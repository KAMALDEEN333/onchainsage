// Middleware for permission enforcements
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { RolesService } from './roles.service';

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  constructor(private readonly rolesService: RolesService) {}

  use(req: any, res: any, next: () => void) {
    const user_id = req.headers['x-user-id'];
    const requiredPermission = req.headers['x-required-permission'];
    if (!user_id || !requiredPermission) {
      throw new ForbiddenException('Missing user or permission info');
    }
    if (!this.rolesService.hasPermission(user_id, BigInt(requiredPermission))) {
      throw new ForbiddenException('Insufficient permissions');
    }
    next();
  }
}
