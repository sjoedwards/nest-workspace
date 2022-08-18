import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MessagesModule } from './messages/messages.module';

async function bootstrap() {
  const app = await NestFactory.create(MessagesModule);

  // Applies the pipe to all of the incoming requests
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
