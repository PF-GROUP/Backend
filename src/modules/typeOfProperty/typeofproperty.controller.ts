import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe,  HttpCode, HttpStatus} from '@nestjs/common';
import { TypeofpropertyService } from './typeofproperty.service';
import { CreateTypeOfPropertyDto } from './create-typeofproperty.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Type of Property')
@Controller('typeofproperty')
export class TypeofpropertyController {
  constructor(private readonly typeofpropertyService: TypeofpropertyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo tipo de propiedad' })
  @ApiResponse({ status: 201 }) // Creado exitosamente
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. DTO inválido)
  @ApiResponse({ status: 409 }) // Conflicto (el tipo de propiedad ya existe)
  @ApiResponse({ status: 500 }) // Error interno del servidor
  async create(@Body() createTypeofpropertyDto: CreateTypeOfPropertyDto) {
    const type = await this.typeofpropertyService.create(createTypeofpropertyDto);
    return {content: type, message: 'Tipo de propiedad creado exitosamente.'};
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de propiedad' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 500 }) // Error interno del servidor
  async findAll() {
    const types = await this.typeofpropertyService.findAll();
    return {content: types, message: 'Tipos de propiedad encontrados exitosamente.'};
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de propiedad por ID' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 404 }) // No encontrado
  @ApiResponse({ status: 500 }) // Error interno del servidor
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const type = await this.typeofpropertyService.findOne(id);
    return {content: type, message: 'Tipo de propiedad encontrado exitosamente.'};
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de propiedad por ID' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. DTO inválido)
  @ApiResponse({ status: 404 }) // No encontrado para actualizar
  @ApiResponse({ status: 409 }) // Conflicto (el nuevo tipo de propiedad ya existe)
  @ApiResponse({ status: 500 }) // Error interno del servidor
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateTypeofpropertyDto: CreateTypeOfPropertyDto) {
    const type = await this.typeofpropertyService.update(id, updateTypeofpropertyDto);
    return {content: type, message: 'Tipo de propiedad actualizado exitosamente.'};
    }
}
