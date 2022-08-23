import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  // This creates the repository for us - so we don't have to do it!
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  // Have to add CurrentUserInterceptor as a provider because it is an injectable
  providers: [
    UsersService,
    AuthService,
    // Globally scoped interceptor - bare in mind this will run for all routes!
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
  ],
})
export class UsersModule {}
