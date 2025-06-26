import { Controller, Post, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus, BadRequestException, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImagesService } from './images.service';
import {ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsOwnerOrAdminGuard } from 'src/guard/isOwnerOrAdmin.guard';
import { PropertyOwnershipGuard } from 'src/guard/property-ownership.guard';
import { CustomizationOwnershipGuard } from 'src/guard/customization-ownership.guard';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}


  @Post('property/:propertyId/gallery')
  @UseGuards(AuthGuard, PropertyOwnershipGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPropertyGalleryImage(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo de imagen.');
    }
    const imageUrl = await this.imagesService.uploadAndAddPropertyGalleryImage(propertyId, file);
    return { message: 'Imagen de galería subida con éxito', url: imageUrl };
  }


  @Post('profile/:userId')
  @UseGuards(AuthGuard, IsOwnerOrAdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserProfilePicture(
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo de imagen.');
    }
    const imageUrl = await this.imagesService.uploadAndSetUserProfilePicture(userId, file);
    return { message: 'Foto de perfil de usuario actualizada con éxito', url: imageUrl };
  }


  @Post('customization/:customizationId/logo')
  @UseGuards(AuthGuard, CustomizationOwnershipGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCustomizationLogo(
    @Param('customizationId', ParseUUIDPipe) customizationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo de imagen.');
    }
    const imageUrl = await this.imagesService.uploadAndSetCustomizationLogo(customizationId, file);
    return { message: 'Logo de customización actualizado con éxito', url: imageUrl };
  }


  @Post('customization/:customizationId/banner')
  @UseGuards(AuthGuard, CustomizationOwnershipGuard) 
  @UseInterceptors(FileInterceptor('file'))
  async uploadCustomizationBanner(
    @Param('customizationId', ParseUUIDPipe) customizationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Se requiere un archivo de imagen.');
    }
    const imageUrl = await this.imagesService.uploadAndSetCustomizationBanner(customizationId, file);
    return { message: 'Banner de customización actualizado con éxito', url: imageUrl };
  }


  @Delete('property/:propertyId/gallery/:imageId')
  @UseGuards(AuthGuard, PropertyOwnershipGuard)
  async removePropertyGalleryImage(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
  ) {
    await this.imagesService.removePropertyGalleryImage(propertyId, imageId);
    return { message: 'Imagen de galería eliminada con éxito.' };
  }
}