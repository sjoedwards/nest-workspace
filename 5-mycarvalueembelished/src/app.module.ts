import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../database-config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // This is how you use values from other services when configuring the database
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return databaseConfig;
      },
    }),
    UsersModule,
    AuthModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // Will strip all unknown properties!
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
