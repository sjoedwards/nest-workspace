import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // We don't want to apply this here - this is because the main.ts file is not included when we do integration tests
  // Instead we put it in app.module.ts in the configure object
  // app.use(
  //   cookieSession({
  //     keys: ['testsession'],
  //   }),
  // );
  // We don't want to apply this here - this is because the main.ts file is not included when we do integration tests
  // Instead we put it in app.module.ts

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     // Will strip all unknown properties!
  //     whitelist: true,
  //   }),
  // );
  await app.listen(3000);
}
bootstrap();
