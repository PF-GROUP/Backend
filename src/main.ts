import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { loggerGlobal } from './middlewares/logger-global/logger-global.middleware';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    return res.sendStatus(204);
  }
  next();
});
  app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://kasapp-preview.vercel.app',
      'https://kasapp-preview-jb4oz0f64-kasapp-preview.vercel.app',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
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
}
bootstrap();
