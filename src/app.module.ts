import {  Module, } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './Config/typeorm';
import { AgencyModule } from './modules/agency/agency.module';
import { ImagesModule } from './modules/images/images.module';
import { CustomizationModule } from './modules/customization/customization.module';
import { PropertyModule } from './modules/property/property.module';
import { TypeofpropertyModule } from './modules/typeOfProperty/typeofproperty.module';
import { UserModule } from './modules/user/user.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { AuthModule } from './modules/auth/auth.module';
import { RegisterModule } from './modules/auth/register/register.module';
import { NodeMailerModule } from './modules/node-mailer/node-mailer.module';




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
  StripeModule,
  CustomizationModule,
  AuthModule,
  RegisterModule,
  NodeMailerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
