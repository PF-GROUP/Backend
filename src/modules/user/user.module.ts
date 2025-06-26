import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { CloudinaryModule } from 'src/shared/cloudinary.module';
import { AgencyModule } from '../agency/agency.module';



@Module({
  imports: [TypeOrmModule.forFeature([User]),CloudinaryModule,forwardRef(() => AgencyModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
