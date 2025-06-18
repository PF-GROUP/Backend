import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, NotFoundException, HttpCode, HttpStatus} from '@nestjs/common';
import { TypeofpropertyService } from './typeofproperty.service';
import { CreateTypeOfPropertyDto } from './create-typeofproperty.dto';

@Controller('typeofproperty')
export class TypeofpropertyController {
  constructor(private readonly typeofpropertyService: TypeofpropertyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTypeofpropertyDto: CreateTypeOfPropertyDto) {
    return await this.typeofpropertyService.create(createTypeofpropertyDto);
  }

  @Get()
  async findAll() {
    return await this.typeofpropertyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.typeofpropertyService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateTypeofpropertyDto: CreateTypeOfPropertyDto) {
    return await this.typeofpropertyService.update(id, updateTypeofpropertyDto);
    }
}
