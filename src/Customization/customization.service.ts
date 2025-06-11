import { Injectable } from '@nestjs/common';
import { CreateCustomizationDto } from './create-customization.dto';

@Injectable()
export class CustomizationService {
  create(createCustomizationDto: CreateCustomizationDto) {
    return 'This action adds a new customization';
  }

  findAll() {
    return `This action returns all customization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customization`;
  }

  update(id: number, updateCustomizationDto: CreateCustomizationDto) {
    return `This action updates a #${id} customization`;
  }

  remove(id: number) {
    return `This action removes a #${id} customization`;
  }
}
