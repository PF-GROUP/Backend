import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus, Query, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload') 
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image') 
  @UseInterceptors(FileInterceptor('file')) 
  async uploadSingleImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string 
  ) {
    if (!file) {
      throw new HttpException('No se proporcionó ningún archivo.', HttpStatus.BAD_REQUEST);
    }

    const imageUrl = await this.uploadService.uploadImage(file, folder);

    return { url: imageUrl };
  }

  @Delete('image/:publicId')
  async deleteImage(@Param('publicId') publicId: string) {
    await this.uploadService.deleteImage(publicId);
    return { message: 'Imagen eliminada exitosamente' };
  }
}
