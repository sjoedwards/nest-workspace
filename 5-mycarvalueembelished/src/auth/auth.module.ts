import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  // This creates the repository for us - so we don't have to do it!
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('JWT_SECRET'),
        };
      },
    }),
  ],
  controllers: [AuthController],
  // Have to add CurrentUserInterceptor as a provider because it is an injectable
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // Globally scoped interceptor - bare in mind this will run for all routes!
  ],
})
export class AuthModule {}
