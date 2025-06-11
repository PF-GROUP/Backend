import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './Config/typeorm';

@Module({
  imports: [    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      useFactory: (config: ConfigService) => config.get('typeorm')!,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
