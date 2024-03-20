import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import * as express from 'express';
import * as ejs from 'ejs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

const config = new DocumentBuilder()
  // .addServer('http://localhost:3000')
  .setTitle('_video swagger')
  .setDescription('The _video API routes')
  .setVersion('1.1')
  .addServer('http://localhost:8000') // Add a server
  .addServer('http://192.168.1.154:8000')
  .build();

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.enableCors();

  await app.listen(8000);
}
bootstrap();
