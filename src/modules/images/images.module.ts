import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from './image.entity';
import { PropertyOwnershipGuard } from 'src/guard/property-ownership.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AgencyService } from '../agency/agency.service';
import { CustomizationModule } from '../customization/customization.module';
import { PropertyModule } from '../property/property.module';
import { User } from '../user/user.entity';




@Module({
  imports:[TypeOrmModule.forFeature([Images, User]), PropertyModule, CustomizationModule],
  controllers: [ImagesController],
  providers: [ImagesService, PropertyOwnershipGuard, AuthGuard, RolesGuard, JwtService, UserService, AgencyService],
  exports: [TypeOrmModule, ImagesService]
})
export class ImagesModule {}
