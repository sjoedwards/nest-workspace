import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Role } from './role.entity';

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
    // Globally scoped interceptor - bare in mind this will run for all routes!
  ],
  exports: [UsersService],
})
export class UsersModule {}
