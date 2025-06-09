import { Module } from '@nestjs/common';
import { TypeofpropertyService } from './typeofproperty.service';
import { TypeofpropertyController } from './TypeOfProperty/typeofproperty.controller';

@Module({
  controllers: [TypeofpropertyController],
  providers: [TypeofpropertyService],
})
export class TypeofpropertyModule {}
