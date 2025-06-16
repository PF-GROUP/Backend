import {Controller, Get, Post, Body, Patch, Param} from '@nestjs/common';
import { CustomizationService } from './customization.service';
import { UpdateCustomizationDto } from './update-customization.dto';
import { CreateCustomizationDto } from './create-customization.dto';

@Controller('agencies/:agencyId/customization')
export class CustomizationController {
  constructor(private readonly customizationService: CustomizationService) {}

  @Post()
  async create(
    @Param('agencyId') agencyId: string,
    @Body() createCustomizationDto: CreateCustomizationDto) 
    {
    return this.customizationService.create(createCustomizationDto, agencyId);
  }

  @Get()
  async findOneByAgencyId(
    @Param('agencyId') agencyId: string)
    {
    return this.customizationService.findOneByAgencyId(agencyId);
  }

  @Patch()
  async update(
    @Param('agencyId') agencyId: string,
    @Body() updateCustomizationDto: UpdateCustomizationDto,) {
    return this.customizationService.updateByAgencyId(agencyId, updateCustomizationDto);
  }
}