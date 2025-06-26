import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property } from './property.entity';
import { TypeOfProperty } from '../typeOfProperty/typeofproperty.entity';
import { TypeofpropertyModule } from '../typeOfProperty/typeofproperty.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, TypeOfProperty]),
    UserModule,
    TypeofpropertyModule,
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService, TypeOrmModule.forFeature([Property])],
})
export class PropertyModule {}
