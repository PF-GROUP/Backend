import { Controller, Get, Post, Body, Patch, Param, HttpCode,Put, HttpStatus, UseGuards, ParseUUIDPipe,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ChangePasswordDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import {  ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201 }) // Creado exitosamente
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. email ya registrado, DTO inválido)
  @ApiResponse({ status: 500 }) // Error interno del servidor
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);
    return { content : user, message: 'Usuario creado exitosamente'}
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener todos los usuarios (Solo Admin)' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 401 }) // No autorizado (AuthGuard)
  @ApiResponse({ status: 403 }) // Prohibido (RolesGuard)
  @ApiResponse({ status: 500 }) // Error interno del servidor
  findAll() {
    const users = this.userService.findAll();
    return {content: users, message: 'Usuarios encontrados exitosamente.'};
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, IsOwnerOrAdminGuard)
  @ApiOperation({ summary: 'Obtener un usuario por ID (Propietario o Admin)' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 401 }) // No autorizado (AuthGuard)
  @ApiResponse({ status: 403 }) // Prohibido (IsOwnerOrAdminGuard)
  @ApiResponse({ status: 404 }) // Usuario no encontrado
  @ApiResponse({ status: 500 }) // Error interno del servidor
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = this.userService.findOne(id);
    return {content: user, message: 'Usuario encontrado exitosamente.'};
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK) 
  @UseGuards(AuthGuard, IsOwnerOrAdminGuard)
  @ApiOperation({ summary: 'Actualizar un usuario por ID (Propietario o Admin)' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. DTO inválido)
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido
  @ApiResponse({ status: 404 }) // Usuario no encontrado
  @ApiResponse({ status: 500 }) // Error interno del servidor
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = this.userService.update(id, updateUserDto);
    return {content: user, message: 'Usuario actualizado exitosamente.'};
  }

  @Put(':id/change-password')
  @ApiOperation({ summary: 'Cambiar la contraseña de un usuario' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. contraseña actual incorrecta, nuevas contraseñas no coinciden, DTO inválido)
  @ApiResponse({ status: 401 }) // No autorizado (si se usa AuthGuard, aunque no está aquí, es buena práctica considerarlo si la sesión es necesaria)
  @ApiResponse({ status: 404 }) // Usuario no encontrado
  @ApiResponse({ status: 500 }) // Error interno del servidor
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
  return this.userService.changePassword(id, changePasswordDto.currentPassword, changePasswordDto.newPassword, changePasswordDto.confirmPassword);
  }

}
