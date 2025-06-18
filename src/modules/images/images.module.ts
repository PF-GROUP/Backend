import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from './image.entity';
import { Property } from '../property/property.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Images, Property])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [TypeOrmModule, ImagesService]
})
export class ImagesModule {}
