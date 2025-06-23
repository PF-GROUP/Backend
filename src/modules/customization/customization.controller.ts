import {Controller, Get, Post, Body, Patch, Param, UseGuards} from '@nestjs/common';
import { CustomizationService } from './customization.service';
import { UpdateCustomizationDto } from './update-customization.dto';
import { CreateCustomizationDto } from './create-customization.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enum/roles.enum';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { AgencyOwnershipGuard } from 'src/guard/agencyOwnership.guard';

@ApiTags('Customization')
@ApiBearerAuth()
@Controller('agencies/:agencyId/customization')
export class CustomizationController {
  constructor(private readonly customizationService: CustomizationService) {}


  @Post()
  @UseGuards(AuthGuard, RolesGuard, AgencyOwnershipGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Crea la configuración de personalización (branding) para una agencia.' })
  async create(
    @Param('agencyId') agencyId: string,
    @Body() createCustomizationDto: CreateCustomizationDto) 
    {
    return this.customizationService.create(createCustomizationDto, agencyId);
  }

  @Get()
  @ApiOperation({ summary: 'Recupera la configuración de personalización de una agencia específica.' })
  async findOneByAgencyId(
    @Param('agencyId') agencyId: string)
    {
    return this.customizationService.findOneByAgencyId(agencyId);
  }

  @Patch()
  @UseGuards(AuthGuard, RolesGuard, AgencyOwnershipGuard)
  @Roles(Role.User, Role.Admin)
  @ApiOperation({ summary: 'Actualiza la configuración de personalización (branding) de una agencia.' })
  async update(
    @Param('agencyId') agencyId: string,
    @Body() updateCustomizationDto: UpdateCustomizationDto,) {
    return this.customizationService.updateByAgencyId(agencyId, updateCustomizationDto);
  }
}