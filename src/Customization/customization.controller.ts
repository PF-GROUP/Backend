import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomizationService } from './customization.service';
import { CreateCustomizationDto } from './create-customization.dto';

@Controller('customization')
export class CustomizationController {
  constructor(private readonly customizationService: CustomizationService) {}

  @Post()
  create(@Body() createCustomizationDto: CreateCustomizationDto) {
    return this.customizationService.create(createCustomizationDto);
  }

  @Get()
  findAll() {
    return this.customizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customizationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomizationDto: CreateCustomizationDto) {
    return this.customizationService.update(+id, updateCustomizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customizationService.remove(+id);
  }
}
