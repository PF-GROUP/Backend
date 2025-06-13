import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [RegisterModule, LoginModule]
})
export class AuthModule {}
