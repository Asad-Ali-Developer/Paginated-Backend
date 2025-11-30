import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Initialize Passport.js for authentication
  app.use(passport.initialize());

  // Apply global validation pipe for request validation
  app.useGlobalPipes(new ValidationPipe());

  // Set global API prefix for versioning (e.g., /api/v1)
  app.setGlobalPrefix('api/v1');

  // Apply custom body parsers (json and urlencoded)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
