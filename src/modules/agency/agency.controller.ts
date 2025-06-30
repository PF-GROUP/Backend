import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AgencyService } from './agency.service';
import { CreateAgencyDto, UpdateAgencyDto } from './agency.dto';
import { AuthGuard } from '../../guard/auth.guard';
import { AgencyGuard } from '../../guard/agency.guard';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../Enum/roles.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('agency')
@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({ summary: 'Crear nueva Agency (Solo User)' })
  @ApiResponse({ status: 201 }) // Creado
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. slug ya existe, datos inválidos)
  @ApiResponse({ status: 401 }) // No autorizado (token ausente/inválido)
  @ApiResponse({ status: 403 }) // Prohibido (rol incorrecto)
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agencyService.create(createAgencyDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todas las agencies' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 401 }) // No autorizado
  findAll() {
    return this.agencyService.findAll();
  }

  @Get('getByUser/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener agency por ID del usuario' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 404 }) // Usuario o agency no encontrada
  async getByUser(@Param('id') id: string) {
    const agency = await this.agencyService.findOneByUserId(id);
    return {content: agency, message: 'Agencia encontrada exitosamente'};
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Obtener agency por slug (Public)' })
  @ApiResponse({ status: 200, description: 'Obtuviste la agency por slug.' })
  @ApiResponse({ status: 404, description: 'Agency no encontrada.' })
  async findBySlug(@Param('slug') slug: string) {
    const agency =  await this.agencyService.findOneBySlug(slug);
    return {content: agency, message: 'Agencia encontrada exitosamente'}
  }

  // Buscar agencias eliminadas logicamente
  @Get('soft-removed')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Obtener todas las agencias eliminadas logicamente (Solo Admin)',
  })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido
  async findRemoved() {
    const removedAgencies = await  this.agencyService.findRemoved();
    return {content: removedAgencies, message: 'Agencias removidas, encontradas exitosamente'}
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener agency por ID (Public)' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 404 }) // Agency no encontrada
  async findOne(@Param('id') id: string) {
    const agency = await this.agencyService.findOne(id);
    return {content: agency, message: 'Agencia encontrada exitosamente'}
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AgencyGuard)
  @ApiOperation({ summary: 'Actualizar agency' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. usuario no incluido, slug duplicado)
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido (permisos de agencia)
  @ApiResponse({ status: 404 }) // Agency no encontrada
  update(@Param('id') id: string, @Body() updateAgencyDto: CreateAgencyDto) {
    return this.agencyService.update(id, updateAgencyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Eliminar permanentemente una agencia (Solo Admin)',
  })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido
  @ApiResponse({ status: 404 }) // Agencia no encontrada
  async remove(@Param('id') id: string) {
    await this.agencyService.remove(id);
    return {message: 'Agencia eliminada exitosamente'}
  }

  @Delete('soft/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Eliminar/restaurar logicamente una agencia (Solo Admin)',
  })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido
  @ApiResponse({ status: 404 }) // Agencia no encontrada
  async softRemove(@Param('id') id: string) {
     const agency = await this.agencyService.toggleSoftRemove(id);
     return {content: agency,message: agency ?  'Agencia restaurada exitosamente' : 'Agencia eliminada exitosamente'}
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard, AgencyGuard)
  @ApiOperation({ summary: 'Actualizar nombre y descripción de agency' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (datos inválidos)
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido (permisos de agencia)
  @ApiResponse({ status: 404 }) // Agency no encontrada
  updateAgency(
    @Param('id') id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    const agency =  this.agencyService.updateAgencyNameAndDescription(
      id,
      updateAgencyDto,
    );
    return {content: agency, message: 'Agencia actualizada exitosamente'}
  }
}
