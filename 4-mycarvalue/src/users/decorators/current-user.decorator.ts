import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // data will never be defined!
  // This can't get access to the dependency inversion container directly - it needs an interceptor. CurrentUserInterceptor.
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
