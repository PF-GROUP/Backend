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
  @ApiResponse({
    status: 201,
    description: 'La Agency ha sido creada exitosamente.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agencyService.create(createAgencyDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todas las agencies' })
  @ApiResponse({ status: 200, description: 'Son todas las agencies.' })
  findAll() {
    return this.agencyService.findAll();
  }

  @Get('getByUser/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener agency por ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Es la agency para el usuario especificado.',
  })
  @ApiResponse({ status: 404, description: 'Usuario o agency no encontrado.' })
  async getByUser(@Param('id') id: string) {
    const agency = await this.agencyService.findOneByUserId(id);
    return agency;
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Obtener agency por slug (Public)' })
  @ApiResponse({ status: 200, description: 'Obtuviste la agency por slug.' })
  @ApiResponse({ status: 404, description: 'Agency no encontrada.' })
  async findBySlug(@Param('slug') slug: string) {
    return await this.agencyService.findOneBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener agency por ID (Public)' })
  @ApiResponse({ status: 200, description: 'Obtuviste la agency.' })
  @ApiResponse({ status: 404, description: 'Agency no encontrada.' })
  findOne(@Param('id') id: string) {
    return this.agencyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AgencyGuard)
  @ApiOperation({ summary: 'Actualizar agency' })
  @ApiResponse({
    status: 200,
    description: 'La agency ha sido actualizada exitosamente.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Agency no encontrada.' })
  update(@Param('id') id: string, @Body() updateAgencyDto: CreateAgencyDto) {
    return this.agencyService.update(id, updateAgencyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({ summary: 'Eliminar permanentemente una agencia (Solo User)' })
  @ApiResponse({
    status: 200,
    description: 'La agencia ha sido eliminada permanentemente.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.agencyService.remove(id);
  }

  @Delete('soft/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({
    summary: 'Eliminar/restaurar logicamente una agencia (Solo User)',
  })
  @ApiResponse({
    status: 200,
    description: 'La agencia ha sido eliminada/restaurada logicamente.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async softRemove(@Param('id') id: string) {
    return this.agencyService.softRemove(id);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard, AgencyGuard)
  @ApiOperation({ summary: 'Actualizar nombre y descripción de agency' })
  @ApiResponse({
    status: 200,
    description: 'La agency ha sido actualizada exitosamente.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Agency no encontrada.' })
  updateAgency(
    @Param('id') id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    return this.agencyService.updateAgencyNameAndDescription(
      id,
      updateAgencyDto,
    );
  }
}
