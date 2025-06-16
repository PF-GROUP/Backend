import { Module } from '@nestjs/common';
import { TypeofpropertyService } from './typeofproperty.service';
import { TypeofpropertyController } from './typeofproperty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfProperty } from './typeofproperty.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([TypeOfProperty]),
  ],
  controllers: [TypeofpropertyController],
  providers: [TypeofpropertyService],
})
export class TypeofpropertyModule {}
