// src/shared/cloudinary/cloudinary.service.ts

import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary'; 
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }


  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {

      const uploadSource = file.path || (file.buffer ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}` : null);

      if (!uploadSource) {
        throw new BadRequestException('El archivo proporcionado no tiene un formato válido para la subida (falta path o buffer).');
      }

      const result: UploadApiResponse = await cloudinary.uploader.upload(uploadSource, {
        folder: 'user_profile_pictures',
      });

      return result.secure_url; 
    } catch (error) {
      console.error('Error al subir imagen a Cloudinary:', error);
      throw new InternalServerErrorException('No se pudo subir la imagen de perfil a Cloudinary.');
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al eliminar imagen de Cloudinary:', error);
    }
  }

  getPublicIdFromUrl(url: string): string | null {
    if (!url) return null;
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) return null;

    const publicIdWithFormat = parts.slice(uploadIndex + 2).join('/');
    return publicIdWithFormat.split('.')[0]; 
  }
}