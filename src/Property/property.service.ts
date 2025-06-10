import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './create-property.dto';

@Injectable()
export class PropertyService {
  create(createPropertyDto: CreatePropertyDto) {
    return 'This action adds a new property';
  }

  findAll() {
    return `This action returns all property`;
  }

  findOne(id: number) {
    return `This action returns a #${id} property`;
  }

  update(id: number, updatePropertyDto: CreatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}
