import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception/http-response-filter.exception';

declare const module: any;

async function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Footsb Backend API')
    .setDescription('Footsb Backend API Documentation')
    .setVersion('1.0.0')
    .addTag('footsb')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  swaggerSetup(app);

  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const PORT = process.env.PORT || 8000;
  await app.listen(PORT);
  console.log(`Listening on port :: ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
