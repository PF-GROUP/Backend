import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from './image.entity';

import { CustomizationModule } from '../customization/customization.module';
import { PropertyModule } from '../property/property.module';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';




@Module({
  imports:[TypeOrmModule.forFeature([Images, User]), PropertyModule, CustomizationModule, UserModule],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule {}
