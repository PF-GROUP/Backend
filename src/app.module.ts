import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
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
import { NodeMailerModule } from './modules/node-mailer/node-mailer.module';
import { DatabaseSeederModule } from './database/database-seeder.module';
import { CloudinaryModule } from './shared/cloudinary.module';
import { config as dotenvconfig} from "dotenv"
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as Schedule } from './modules/schedule/schedule.module';
dotenvconfig({path: ".env.development"})




@Module({
  imports: [
    ScheduleModule.forRoot(),
    
    JwtModule.register({
    global: true,
        secret:'secret', // Reemplaza este valor por una variable de entorno en producción
        signOptions: { expiresIn: '1d' }, // Configura el tiempo de expiración del token
      }),
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
    NodeMailerModule,
    DatabaseSeederModule,
    CloudinaryModule,
    Schedule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
