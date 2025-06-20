import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

import { AgencyModule } from '../agency/agency.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'theBestPassword??', // Reemplaza este valor por una variable de entorno en producción
      signOptions: { expiresIn: '1d' }, // Configura el tiempo de expiración del token
    }),UserModule,AgencyModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
