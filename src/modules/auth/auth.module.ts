import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Agency } from '../agency/agency.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'theBestPassword??', // Reemplaza este valor por una variable de entorno en producción
      signOptions: { expiresIn: '1d' }, // Configura el tiempo de expiración del token
    }),TypeOrmModule.forFeature([User, Agency])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
