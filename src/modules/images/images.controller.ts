import { Controller, Post, Param, Delete, ParseUUIDPipe, BadRequestException, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ImagesService } from './images.service';
import {ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IsOwnerOrAdminGuard } from 'src/guard/isOwnerOrAdmin.guard';
import { PropertyOwnershipGuard } from 'src/guard/property-ownership.guard';
import { CustomizationOwnershipGuard } from 'src/guard/customization-ownership.guard';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}


  @Post('property/:propertyId/gallery')
  @UseGuards(AuthGuard, PropertyOwnershipGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Subir múltiples imágenes a la galería de una propiedad' })
  @ApiConsumes('multipart/form-data') // Esto es importante para indicar el tipo de datos
  @ApiResponse({ status: 201 }) // Creado exitosamente
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. no se enviaron archivos, formato inválido)
  @ApiResponse({ status: 401 }) // No autorizado (token ausente/inválido)
  @ApiResponse({ status: 403 }) // Prohibido (no es propietario de la propiedad o admin)
  @ApiResponse({ status: 404 }) // Propiedad no encontrada
  @ApiResponse({ status: 500 }) // Error interno del servidor (ej. error al subir a Cloudinary)
  async uploadPropertyGalleryImages(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Se requiere un archivo de imagen.');
    }
  
    const imageUrls = await this.imagesService.uploadAndAddPropertyGalleryImages(propertyId, files);
    
    return { message: 'Imágenes de galería subidas con éxito', content:{urls: imageUrls }};
  }


  @Post('profile/:userId')
  @UseGuards(AuthGuard, IsOwnerOrAdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir y actualizar la foto de perfil de un usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201 }) // Creado/Actualizado exitosamente
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. no se envió archivo)
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido (no es el propietario del perfil o admin)
  @ApiResponse({ status: 404 }) // Usuario no encontrado
  @ApiResponse({ status: 500 }) // Error interno del servidor
  async uploadUserProfilePicture(
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo de imagen.');
    }
    const imageUrl = await this.imagesService.uploadAndSetUserProfilePicture(userId, file);
    return { message: 'Foto de perfil de usuario actualizada con éxito', content:{url: imageUrl} };
  }


  @Post('customization/:customizationId/logo')
  @UseGuards(AuthGuard, CustomizationOwnershipGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir y actualizar el logo de personalización de una agencia' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201 }) // Creado/Actualizado exitosamente
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. no se envió archivo)
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido (no es propietario de la customización o admin)
  @ApiResponse({ status: 404 }) // Customization no encontrada
  @ApiResponse({ status: 500 }) // Error interno del servidor
  async uploadCustomizationLogo(
    @Param('customizationId', ParseUUIDPipe) customizationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo de imagen.');
    }
    const imageUrl = await this.imagesService.uploadAndSetCustomizationLogo(customizationId, file);
    return { message: 'Logo de customización actualizado con éxito', content:{url: imageUrl} };
  }


  @Post('customization/:customizationId/banner')
  @UseGuards(AuthGuard, CustomizationOwnershipGuard) 
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir y actualizar el banner de personalización de una agencia' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201 }) // Creado/Actualizado exitosamente
  @ApiResponse({ status: 400 }) // Solicitud incorrecta
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido
  @ApiResponse({ status: 404 }) // Customization no encontrada
  @ApiResponse({ status: 500 }) // Error interno del servidor
  async uploadCustomizationBanner(
    @Param('customizationId', ParseUUIDPipe) customizationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo de imagen.');
    }
    const imageUrl = await this.imagesService.uploadAndSetCustomizationBanner(customizationId, file);
    return { message: 'Banner de customización actualizado con éxito', content:{url: imageUrl} };
  }


  @Delete('property/:propertyId/gallery/:imageId')
  @UseGuards(AuthGuard, PropertyOwnershipGuard)
  @ApiOperation({ summary: 'Eliminar una imagen de la galería de una propiedad' })
  @ApiResponse({ status: 200 }) // Éxito
  @ApiResponse({ status: 400 }) // Solicitud incorrecta (ej. imagen no pertenece a la propiedad)
  @ApiResponse({ status: 401 }) // No autorizado
  @ApiResponse({ status: 403 }) // Prohibido
  @ApiResponse({ status: 404 }) // Propiedad no encontrada
  @ApiResponse({ status: 500 }) // Error interno del servidor
  async removePropertyGalleryImage(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ) {
    await this.imagesService.removePropertyGalleryImage(propertyId, imageId);
    return { message: 'Imagen de galería eliminada con éxito.' };
  }
}