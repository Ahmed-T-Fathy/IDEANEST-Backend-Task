import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception-filters/http.exception-filter';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as  ExpressMongoSanitize from 'express-mongo-sanitize';
import * as xssClean from 'xss-clean';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: '*', // Specify allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(helmet());
  app.use(ExpressMongoSanitize()); // Prevent MongoDB operator injection
  app.use(xssClean());

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(8080);
}
bootstrap();
