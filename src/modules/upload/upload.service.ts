
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File, folder?: string): Promise<string> {
    try {
      const resultUrl = await this.cloudinaryService.uploadFile(file);
      return resultUrl;
    } catch (error) {
      console.error('Error en UploadService al subir imagen:', error);
      throw new InternalServerErrorException('Error al subir la imagen al servidor de archivos.');
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await this.cloudinaryService.deleteFile(publicId);
    } catch (error) {
      console.error('Error en UploadService al eliminar imagen:', error);
      throw new InternalServerErrorException('Error al eliminar la imagen del servidor de archivos.');
    }
  }
}