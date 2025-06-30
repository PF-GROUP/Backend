import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AgencyModule } from '../agency/agency.module';
import { NodeMailerModule } from '../node-mailer/node-mailer.module';



@Module({
  imports: [
    UserModule,AgencyModule,NodeMailerModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule {}
