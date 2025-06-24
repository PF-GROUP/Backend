import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { CloudinaryModule } from 'src/shared/cloudinary.module';



@Module({
  imports: [TypeOrmModule.forFeature([User]),CloudinaryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
