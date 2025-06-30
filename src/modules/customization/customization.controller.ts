import {Controller, Get, Post, Body, Patch, Param, UseGuards} from '@nestjs/common';
import { CustomizationService } from './customization.service';
import { UpdateCustomizationDto } from './update-customization.dto';
import { CreateCustomizationDto } from './create-customization.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enum/roles.enum';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';

@ApiTags('Customization')
@Controller('agencies/:agencyId/customization')
export class CustomizationController {
  constructor(private readonly customizationService: CustomizationService) {}


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Crea la configuración de personalización (branding) para una agencia.' })
  @ApiResponse({ status: 201 }) // Creado exitosamente
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. DTO inválido)
  @ApiResponse({ status: 401 }) // No autorizado (token ausente/inválido)
  @ApiResponse({ status: 403 }) // Prohibido (rol incorrecto)
  @ApiResponse({ status: 404 }) // Agencia no encontrada (desde el servicio)
  @ApiResponse({ status: 409 }) // Conflicto (la agencia ya tiene personalización)
  async create(
    @Param('agencyId') agencyId: string,
    @Body() createCustomizationDto: CreateCustomizationDto) 
    {
    const customization = await this.customizationService.create(createCustomizationDto, agencyId);
    return {content: customization, message: 'Configuración creada exitosamente'}
  }

  @Get()
  @ApiOperation({ summary: 'Recupera la configuración de personalización de una agencia específica.' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 404 }) // Agencia o personalización no encontrada
  async findOneByAgencyId(
    @Param('agencyId') agencyId: string)
    {
    const customization = await this.customizationService.findOneByAgencyId(agencyId);
    return {content: customization, message: 'Configuración recuperada exitosamente'}
  }

  @Patch()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Actualiza la configuración de personalización (branding) de una agencia.' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. DTO inválido)
  @ApiResponse({ status: 401 }) // No autorizado (token ausente/inválido)
  @ApiResponse({ status: 403 }) // Prohibido (rol incorrecto)
  @ApiResponse({ status: 404 }) // Agencia o personalización no encontrada (desde el servicio)
  @ApiResponse({ status: 500 }) // Error interno del servidor (ej. error al guardar en DB)
  @ApiOperation({ summary: 'Actualiza la configuración de personalización (branding) de una agencia.' })
  async update(
    @Param('agencyId') agencyId: string,
    @Body() updateCustomizationDto: UpdateCustomizationDto,) {
    const customization = await this.customizationService.updateByAgencyId(agencyId, updateCustomizationDto);
    return {content: customization, message: 'Configuración actualizada exitosamente'}
  }
}