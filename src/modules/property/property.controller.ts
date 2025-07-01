import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './create-property.dto';
import { UpdatePropertyDto } from './update-property.dto';
import { Property } from './property.entity';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guard/auth.guard';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../Enum/roles.enum';

@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: 'Crear una nueva propiedad (Agente o Admin)',
    description: 'Crea una nueva propiedad.',
  })
  @ApiBody({
    type: CreatePropertyDto,
    description: 'Datos de la propiedad a crear',
    examples: {
      propiedadEjemplo: {
        summary: 'Ejemplo de creacion de propiedad',
        value: {
          name: 'Casa en la playa',
          status: 'Disponible',
          type: 'Venta',
          address: 'Av. Costera 123',
          city: 'Acapulco',
          price: 2500000,
          m2: 180,
          bathrooms: 3,
          description: 'Hermosa casa frente al mar con acabados de lujo',
          rooms: 4,
          id_images: ['uuid-imagen-1', 'uuid-imagen-2'],
          type_of_property_id: 'dc2d7345-18a5-4f65-a5a4-bade75c732ff',
          agency: '2ac3ee24-c642-42fd-aad4-9c53abf7e88a',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'La propiedad ha sido creada exitosamente',
    type: Property,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada invalidos o faltantes',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Se requiere autenticacion',
  })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para realizar esta accion',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al crear la propiedad',
  })
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    const property = await this.propertyService.create(createPropertyDto);
    return { content: property, message: 'Propiedad creada exitosamente' };
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las propiedades (Publico)',
    description:
      'Retorna todas las propiedades, incluyendo las eliminadas logicamente.',
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Incluir propiedades eliminadas logicamente (default: false)',
  })
  @ApiOkResponse({
    description: 'Lista de propiedades obtenida exitosamente',
    type: [Property],
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al obtener las propiedades',
  })
  async findAll(@Query('includeDeleted') includeDeleted: boolean = false) {
    const properties = await this.propertyService.findAll(includeDeleted);
    return {
      content: properties,
      message: 'Propiedades encontradas exitosamente',
    };
  }

  @Get('agency/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: 'Obtener propiedades por ID de agencia',
    description:
      'Obtiene todas las propiedades asociadas a una agencia especifica.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID de la agencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Lista de propiedades de la agencia obtenida exitosamente',
    type: [Property],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron propiedades para la agencia especificada',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Se requiere autenticacion',
  })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para realizar esta accion',
  })
  async findByAgencyId(@Param('id') agencyId: string) {
    const properties = await this.propertyService.findByAgencyId(agencyId);
    return {
      content: properties,
      message:
        properties.length > 0
          ? 'Propiedades encontradas exitosamente'
          : 'No se encontraron propiedades para esta agencia',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una propiedad por ID (Publico)',
    description: 'Obtiene los detalles de una propiedad por su ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID unico de la propiedad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: 'Incluir propiedades eliminadas logicamente (Solo Admin)',
  })
  @ApiOkResponse({
    description: 'Propiedad encontrada exitosamente',
    type: Property,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontro ninguna propiedad con el ID proporcionado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al obtener la propiedad',
  })
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted: boolean = false,
  ) {
    const property = await this.propertyService.findOne(id, includeDeleted);
    return { content: property, message: 'Propiedad encontrada exitosamente' };
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    summary: 'Actualizar una propiedad existente por ID (Agente o Admin)',
    description: 'Actualiza los datos de una propiedad por su ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID unico de la propiedad a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdatePropertyDto,
    description: 'Campos a actualizar de la propiedad',
    examples: {
      actualizacionEjemplo: {
        summary: 'Ejemplo de actualizacion de propiedad',
        value: {
          price: 2700000,
          status: 'Vendido',
          description: 'Precio actualizado y propiedad marcada como vendida',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Propiedad actualizada exitosamente',
    type: Property,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada invalidos o faltantes',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Se requiere autenticacion',
  })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para realizar esta accion',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontro ninguna propiedad con el ID proporcionado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al actualizar la propiedad',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    const property = await this.propertyService.update(id, updatePropertyDto);
    return { content: property, message: 'Propiedad actualizada exitosamente' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Eliminar una propiedad de forma permanente (Solo Admin)',
    description:
      'Elimina permanentemente una propiedad de la base de datos. Esta accion no se puede deshacer.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID unico de la propiedad a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Propiedad eliminada permanentemente con exito',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Se requiere autenticacion',
  })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para realizar esta accion',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontro ninguna propiedad con el ID proporcionado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al eliminar la propiedad',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.propertyService.remove(id);
    return { message: 'Propiedad eliminada permanentemente con exito' };
  }

  @Delete('soft/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User) // Solo usuarios con rol User pueden acceder
  @ApiOperation({
    summary: 'Eliminar propiedad permanentemente (Solo Usuario)',
    description:
      'Elimina permanentemente una propiedad de la base de datos. Esta accion no se puede deshacer.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID unico de la propiedad a eliminar permanentemente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Propiedad eliminada permanentemente con éxito',
    type: Property,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Se requiere autenticacion',
  })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para realizar esta accion',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontro ninguna propiedad con el ID proporcionado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor al eliminar la propiedad',
  })
  async permanentRemove(@Param('id') id: string) {
    await this.propertyService.permanentRemove(id);
    return {
      message: 'Propiedad eliminada permanentemente con exito',
    };
  }
}
