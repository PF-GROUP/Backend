import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeofpropertyService } from './typeofproperty.service';
import { CreateTypeofpropertyDto } from './create-typeofproperty.dto';
import { UpdateTypeofpropertyDto } from './dto/update-typeofproperty.dto';

@Controller('typeofproperty')
export class TypeofpropertyController {
  constructor(private readonly typeofpropertyService: TypeofpropertyService) {}

  @Post()
  create(@Body() createTypeofpropertyDto: CreateTypeofpropertyDto) {
    return this.typeofpropertyService.create(createTypeofpropertyDto);
  }

  @Get()
  findAll() {
    return this.typeofpropertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeofpropertyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeofpropertyDto: UpdateTypeofpropertyDto) {
    return this.typeofpropertyService.update(+id, updateTypeofpropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeofpropertyService.remove(+id);
  }
}
