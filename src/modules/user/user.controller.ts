import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, ParseUUIDPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Role } from 'src/Enum/roles.enum';
import { Roles } from 'src/decorators/role.decorator';
import { IsOwnerOrAdminGuard } from 'src/guard/isOwnerOrAdmin.guard';
import { FileInterceptor } from '@nestjs/platform-express';

ApiTags('User')
ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de usuario inválidos.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener todos los usuarios (Solo Admin)' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido (no es administrador).' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, IsOwnerOrAdminGuard)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido (no tiene acceso al perfil).' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Post(':id/profile-picture') //se usa POST para actualizar o subir una imagen por que es una decisión pragmática y funcionalmente correcta que no causa problemas y es común en el desarrollo web.
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, IsOwnerOrAdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir o actualizar la foto de perfil de un usuario',
    description: 'Permite al usuario autenticado (o a un administrador) subir o cambiar su foto de perfil. La imagen se sube a Cloudinary y su URL se guarda en el perfil del usuario.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'El archivo de imagen a subir (JPEG, PNG, etc.)'
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 200, description: 'Foto de perfil actualizada exitosamente.' }) 
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' }) 
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido (no es el usuario o no es admin).' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async uploadProfilePicture(
    @Param('id', ParseUUIDPipe) userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo para la foto de perfil.');
    }
    const newImageUrl = await this.userService.updateProfilePicture(userId, file);
    return {
      message: 'Foto de perfil actualizada exitosamente',
      profilePictureUrl: newImageUrl,
    };
  }


  @Patch(':id')
  @HttpCode(HttpStatus.OK) 
  @UseGuards(AuthGuard, IsOwnerOrAdminGuard)
  @ApiOperation({ summary: 'Actualizar un usuario por ID (Agente o Admin dueño)' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido (no es dueño o no es Admin).' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Eliminar un usuario por ID (Solo Admin)' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido (no es administrador).' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
