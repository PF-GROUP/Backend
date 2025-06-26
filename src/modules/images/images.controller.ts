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
  async create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Get()
  async findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.imagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
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
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.imagesService.remove(id);
  }
}
