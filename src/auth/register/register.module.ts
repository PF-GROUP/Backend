import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/User/user.entity';
import { Agency } from 'src/Agency/agency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Agency])],
  controllers: [RegisterController],
  providers: [RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
