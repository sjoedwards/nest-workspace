import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'types/enums';

export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Execution context is like a wrapper around the request
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    // Some required roles are held by the user
    return requiredRoles.some((role) => request.user.roles?.includes(role));
  }
}
