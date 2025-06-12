import { Injectable } from '@nestjs/common';
import { CreateTypeOfPropertyDto } from './create-typeofproperty.dto';

@Injectable()
export class TypeofpropertyService {
  create(CreateTypeOfPropertyDto: CreateTypeOfPropertyDto) {
    return 'This action adds a new typeofproperty';
  }

  findAll() {
    return `This action returns all typeofproperty`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typeofproperty`;
  }

  update(id: number, updateTypeofpropertyDto: CreateTypeOfPropertyDto) {
    return `This action updates a #${id} typeofproperty`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeofproperty`;
  }
}
