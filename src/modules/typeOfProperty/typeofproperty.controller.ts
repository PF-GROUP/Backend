import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe,  HttpCode, HttpStatus} from '@nestjs/common';
import { TypeofpropertyService } from './typeofproperty.service';
import { CreateTypeOfPropertyDto } from './create-typeofproperty.dto';

@Controller('typeofproperty')
export class TypeofpropertyController {
  constructor(private readonly typeofpropertyService: TypeofpropertyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTypeofpropertyDto: CreateTypeOfPropertyDto) {
    const type = await this.typeofpropertyService.create(createTypeofpropertyDto);
    return {content: type, message: 'Tipo de propiedad creado exitosamente.'};
  }

  @Get()
  async findAll() {
    const types = await this.typeofpropertyService.findAll();
    return {content: types, message: 'Tipos de propiedad encontrados exitosamente.'};
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const type = await this.typeofpropertyService.findOne(id);
    return {content: type, message: 'Tipo de propiedad encontrado exitosamente.'};
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateTypeofpropertyDto: CreateTypeOfPropertyDto) {
    const type = await this.typeofpropertyService.update(id, updateTypeofpropertyDto);
    return {content: type, message: 'Tipo de propiedad actualizado exitosamente.'};
    }
}
