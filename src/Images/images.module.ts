import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './image.entity';
import { Property } from 'src/Property/property.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Media, Property])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [TypeOrmModule, ImagesService]
})
export class ImagesModule {}
