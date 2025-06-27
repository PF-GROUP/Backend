import {Controller, Get, Post, Body, Patch, Param, UseGuards} from '@nestjs/common';
import { CustomizationService } from './customization.service';
import { UpdateCustomizationDto } from './update-customization.dto';
import { CreateCustomizationDto } from './create-customization.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  async create(
    @Param('agencyId') agencyId: string,
    @Body() createCustomizationDto: CreateCustomizationDto) 
    {
    const customization = await this.customizationService.create(createCustomizationDto, agencyId);
    return {content: customization, message: 'Configuración creada exitosamente'}
  }

  @Get()
  @ApiOperation({ summary: 'Recupera la configuración de personalización de una agencia específica.' })
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
  async update(
    @Param('agencyId') agencyId: string,
    @Body() updateCustomizationDto: UpdateCustomizationDto,) {
    const customization = await this.customizationService.updateByAgencyId(agencyId, updateCustomizationDto);
    return {content: customization, message: 'Configuración actualizada exitosamente'}
  }
}