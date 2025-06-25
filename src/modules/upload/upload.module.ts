// src/modules/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryModule } from 'src/shared/cloudinary.module';

@Module({
  imports: [CloudinaryModule], 
  controllers: [UploadController], 
  providers: [UploadService], 
  exports: [UploadService], 
})
export class UploadModule {}