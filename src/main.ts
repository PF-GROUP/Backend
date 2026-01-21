import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { loggerGlobal } from './middlewares/logger-global/logger-global.middleware';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://kasapp-preview.vercel.app/','https://kasapp-preview.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  console.log('PORT:', process.env.PORT);
  app.use('/stripe/webhook', express.raw({ type: 'application/json' }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kasapp')
    .setVersion('1.0')
    .setDescription('Esta es la documentacionde nuestra app Kasapp')
    .addCookieAuth('token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'token',
      description: 'Token de autenticación almacenado en cookie'
    })
    .build();
  app.use(cookieParser());
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.use(loggerGlobal);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`🚀 API listening on ${process.env.PORT}`);
}
bootstrap();
