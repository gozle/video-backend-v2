import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import * as express from 'express';
import * as ejs from 'ejs';
import * as conf from './config/config.json';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as dotenv from 'dotenv';

dotenv.config();
const URL = process.env.URL || 'http://localhost';
const PORT = process.env.PORT || 7000;
const config = new DocumentBuilder()
  .setTitle('Gozle_video swagger')
  .setDescription('The _video API routes')
  .setVersion('1.0')
  .addServer('http://localhost:7000') // Add a server
  .addServer(`https://video-api-dev.gozle.org:7000`)
  .addServer(`${URL}:${PORT}`)
  .build();

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  // app.setViewEngine('ejs');
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.enableCors();

  await app.listen(PORT, () => {
    console.log('WORKING ON PORT: ' + PORT);
  });
}
bootstrap();
