import { MiddlewareConsumer, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserMiddleware } from '../middleware/current-user.middleware';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  // This creates the repository for us - so we don't have to do it!
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  ],
  controllers: [UsersController],
  // Have to add CurrentUserInterceptor as a provider because it is an injectable
  providers: [
    UsersService,
    AuthService,
    // Globally scoped interceptor - bare in mind this will run for all routes!
  ],
})
export class UsersModule {
  // This is how you scope middleware to all controllersof a module - will run after those in app.module.ts
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
