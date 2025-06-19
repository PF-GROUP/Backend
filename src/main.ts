import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import {loggerGlobal} from './middlewares/logger-global/logger-global.middleware'
import * as express from 'express';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://tkdsystem.ddns.net:3001', 'http://tkdsystem.ddns.net:3000', "kasapp.serveminecraft.net:3000", "kasapp.serveminecraft.net:3001"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  })
  app.use('/stripe/webhook', express.raw({ type: 'application/json' }));

  const swaggerConfig = new DocumentBuilder()
  .setTitle('Kasapp')
  .setVersion('1.0')
  .setDescription(
  "Esta es la documentacionde nuestra app Kasapp")
  .build();
  app.use(cookieParser());
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
