import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  // Execution context is like a wrapper around the request
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.user.admin;
  }
}
