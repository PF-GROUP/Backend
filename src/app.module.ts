import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './Config/typeorm';

import { AgencyModule } from './Agency/agency.module';
import { ImagesModule } from './Images/images.module';
import { CustomizationModule } from './Customization/customization.module';
import { PropertyModule } from './Property/property.module';
import { TypeofpropertyModule } from './TypeOfProperty/typeofproperty.module';
import { UserModule } from './User/user.module';
import { AuthModule } from './auth/auth.module';
import { RegisterModule } from './auth/register/register.module';
import { LoginModule } from './auth/login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      useFactory: (config: ConfigService) => config.get('typeorm')!,
    }),
    AgencyModule,
    ImagesModule,
    PropertyModule,
    TypeofpropertyModule,
    UserModule,
    CustomizationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
