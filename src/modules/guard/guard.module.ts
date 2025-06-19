// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]),JwtModule.register({})],
  providers: [AuthGuard],
  exports: [AuthGuard, JwtModule], 
})
export class GuardModule {}