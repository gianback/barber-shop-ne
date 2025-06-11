import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignore unknown properties
      forbidNonWhitelisted: true, // print an error when unknown properties are found
    }),
  );
  app.enableCors({
    origin: process.env.FRONTEND_URL,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
