import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { IsOwnerOrAdminGuard } from 'src/guard/isOwnerOrAdmin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, AuthGuard, RolesGuard, IsOwnerOrAdminGuard, JwtService],
  exports: [UserService]
})
export class UserModule {}
