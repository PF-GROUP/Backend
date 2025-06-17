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
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './create-property.dto';
import { UpdatePropertyDto } from './update-property.dto';
import { Property } from './property.entity';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
  ): Promise<Property> {
    return this.propertyService.create(createPropertyDto);
  }

  @Get()
  async findAll(
    @Query('includeDeleted') includeDeleted: boolean = false,
  ): Promise<Property[]> {
    return this.propertyService.findAll(includeDeleted);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted: boolean = false,
  ): Promise<Property> {
    return this.propertyService.findOne(id, includeDeleted);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertyService.update(id, updatePropertyDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.propertyService.remove(+id);
  // }
}
