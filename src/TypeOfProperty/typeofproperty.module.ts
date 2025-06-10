import { Module } from '@nestjs/common';
import { TypeofpropertyService } from './typeofproperty.service';
import { TypeofpropertyController } from './typeofproperty.controller';

@Module({
  controllers: [TypeofpropertyController],
  providers: [TypeofpropertyService],
})
export class TypeofpropertyModule {}
