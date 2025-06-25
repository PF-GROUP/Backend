import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus, BadRequestException, UseGuards } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './create-image.dto';
import { UpdateImageDto } from './update-image.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enum/roles.enum';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Subir una nueva imagen (Agente o Admin)' })
  @ApiResponse({ status: 201, description: 'Imagen creada exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido (rol incorrecto).' })
  async create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las imágenes (Público)' })
  @ApiResponse({ status: 200, description: 'Listado de todas las imágenes.' })
  async findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una imagen por ID (Público)' })
  @ApiResponse({ status: 200, description: 'Detalle de una imagen.' })
  @ApiResponse({ status: 404, description: 'Imagen no encontrada.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.imagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Actualizar una imagen por ID (Agente o Admin dueño)' })
  @ApiResponse({ status: 200, description: 'Imagen actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido (rol o no es dueño).' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    if (Object.keys(updateImageDto).length === 0) {
      throw new BadRequestException('Se requiere al menos un campo para actualizar la imagen.');
    }
    return this.imagesService.update(id, updateImageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Eliminar una imagen por ID (Agente o Admin dueño)' })
  @ApiResponse({ status: 204, description: 'Imagen eliminada exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido (rol o no es dueño).' })
  @ApiResponse({ status: 404, description: 'Imagen no encontrada.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.imagesService.remove(id);
  }
}
