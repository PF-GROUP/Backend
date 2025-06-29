import { Controller, Get, Post, Body, Patch, Param, HttpCode,Put, HttpStatus, UseGuards, ParseUUIDPipe,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ChangePasswordDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import {  ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Role } from 'src/Enum/roles.enum';
import { Roles } from 'src/decorators/role.decorator';
import { IsOwnerOrAdminGuard } from 'src/guard/isOwnerOrAdmin.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);
    return { content : user, message: 'Usuario creado exitosamente'}
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll() {
    const users = this.userService.findAll();
    return {content: users, message: 'Usuarios encontrados exitosamente.'};
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, IsOwnerOrAdminGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = this.userService.findOne(id);
    return {content: user, message: 'Usuario encontrado exitosamente.'};
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK) 
  @UseGuards(AuthGuard, IsOwnerOrAdminGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = this.userService.update(id, updateUserDto);
    return {content: user, message: 'Usuario actualizado exitosamente.'};
  }

  @Put(':id/change-password')
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
  return this.userService.changePassword(id, changePasswordDto.currentPassword, changePasswordDto.newPassword, changePasswordDto.confirmPassword);
  }

}
