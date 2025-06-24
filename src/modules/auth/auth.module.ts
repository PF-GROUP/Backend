import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AgencyModule } from '../agency/agency.module';

import { NodeMailerModule } from '../node-mailer/node-mailer.module';

@Module({
  imports: [JwtModule,
    UserModule,AgencyModule,NodeMailerModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
