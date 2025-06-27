import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { Property } from '../property/property.entity';
import { User } from '../user/user.entity';
import { Images } from './image.entity';
import { Customization } from '../customization/customization.entity';


@Injectable()
export class ImagesService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Images)
    private readonly imageRepository: Repository<Images>,
    @InjectRepository(Customization)
    private readonly customizationRepository: Repository<Customization>,

  ) {}

  private async deleteOldImageFromCloudinary(publicIdOrUrl: string): Promise<void> {
    if (!publicIdOrUrl) return;

    let publicIdToDelete: string | null = null;

    if (publicIdOrUrl.includes('/res.cloudinary.com/')) { 
        publicIdToDelete = this.cloudinaryService.getPublicIdFromUrl(publicIdOrUrl);
    } else { 
        publicIdToDelete = publicIdOrUrl;
    }
    
    if (publicIdToDelete) {
        try {
            await this.cloudinaryService.deleteFile(publicIdToDelete);
            console.log(`[ImagesService] Old image deleted from Cloudinary: ${publicIdToDelete}`);
        } catch (error) {
            console.error(`[ImagesService] Error deleting old image from Cloudinary (ID: ${publicIdToDelete}):`, error.message);
        }
    } else {
        console.warn(`[ImagesService] Could not determine publicId from input: ${publicIdOrUrl}. Not deleted from Cloudinary.`);
    }
  }


  async uploadAndAddPropertyGalleryImages(propertyId: string, files: Array<Express.Multer.File>): Promise<string[]> {
    const property = await this.propertyRepository.findOne({ 
        where: { id: propertyId }
    });
    if (!property) {
      throw new NotFoundException(`Propiedad con ID "${propertyId}" no encontrada.`);
    }

    const uploadedImageUrls: string[] = [];

    for (const file of files) {
      try {
        const newImageUrl = await this.cloudinaryService.uploadFile(file);
        const newPublicId = this.cloudinaryService.getPublicIdFromUrl(newImageUrl);
        
        const newImage = this.imageRepository.create({
          file: newImageUrl,
          publicId: newPublicId,
          property: property,
        });

        await this.imageRepository.save(newImage);
        uploadedImageUrls.push(newImageUrl);

      } catch (error) {

        console.error(`[ImagesService] Error al subir una imagen de galería (${file.originalname}) para propiedad ${propertyId}:`, error);
      }
    }

    if (uploadedImageUrls.length === 0 && files.length > 0) {
      throw new InternalServerErrorException('No se pudo subir ninguna de las imágenes proporcionadas para la galería.');
    }

    return uploadedImageUrls;
  }

  async uploadAndSetUserProfilePicture(userId: string, file: Express.Multer.File): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }

    try {

      if(user.profilePictureUrl)
      await this.deleteOldImageFromCloudinary(user.profilePictureUrl); 


      const newImageUrl = await this.cloudinaryService.uploadFile(file);


      user.profilePictureUrl = newImageUrl;
      await this.userRepository.save(user); 
      
      return newImageUrl;
    } catch (error) {
      console.error(`[ImagesService] Error al subir y actualizar foto de perfil para usuario ${userId}:`, error);
      throw new InternalServerErrorException('No se pudo subir y/o asociar la foto de perfil del usuario.');
    }
  }

  async uploadAndSetCustomizationLogo(customizationId: string, file: Express.Multer.File): Promise<string> {

    const customization = await this.customizationRepository.findOne({ 
        where: { id: customizationId }
    });
    if (!customization) {
      throw new NotFoundException(`Customization con ID "${customizationId}" no encontrada. Asegúrese de que la entidad de personalización ya existe.`);
    }

    try {

      if (customization.logoImage) { 
        await this.deleteOldImageFromCloudinary(customization.logoImage);
      }
      
      const newImageUrl = await this.cloudinaryService.uploadFile(file); 

      customization.logoImage = newImageUrl; 
      await this.customizationRepository.save(customization); 
      
      return newImageUrl;
    } catch (error) {
      console.error(`[ImagesService] Error al subir y actualizar logo para customización ${customizationId}:`, error);
      throw new InternalServerErrorException('No se pudo subir y/o asociar el logo a la customización.');
    }
  }

  async uploadAndSetCustomizationBanner(customizationId: string, file: Express.Multer.File): Promise<string> {
    const customization = await this.customizationRepository.findOne({ 
        where: { id: customizationId }
    });
    if (!customization) {
      throw new NotFoundException(`Customization con ID "${customizationId}" no encontrada. Asegúrese de que la entidad de personalización ya existe.`);
    }

    try {

      if (customization.banner) { 
        await this.deleteOldImageFromCloudinary(customization.banner);
      }
      
      const newImageUrl = await this.cloudinaryService.uploadFile(file); 
      
      customization.banner = newImageUrl;
      await this.customizationRepository.save(customization); 

      return newImageUrl;
    } catch (error) {
      console.error(`[ImagesService] Error al subir y actualizar banner para customización ${customizationId}:`, error);
      throw new InternalServerErrorException('No se pudo subir y/o asociar el banner a la customización.');
    }
  }


  async removePropertyGalleryImage(propertyId: string, imageId: string): Promise<void> {

    const property = await this.propertyRepository.findOne({ 
        where: { id: propertyId }, 
        relations: ['images'] 
    });
    if (!property) {
      throw new NotFoundException(`Propiedad con ID "${propertyId}" no encontrada.`);
    }


    const imageToRemove = property.images.find(img => img.id === imageId);
    if (!imageToRemove) {
      throw new BadRequestException('La imagen especificada no se encuentra en la galería de esta propiedad.');
    }

    try {

      if (imageToRemove.publicId) {
        await this.deleteOldImageFromCloudinary(imageToRemove.publicId);
      } else {

        console.warn(`[ImagesService] publicId no encontrado para la imagen ${imageId}. Intentando eliminar con la URL: ${imageToRemove.file}`);
        await this.deleteOldImageFromCloudinary(imageToRemove.file);
      }

      await this.imageRepository.remove(imageToRemove);
      
      console.log(`[ImagesService] Imagen de galería ${imageId} eliminada con éxito de la propiedad ${propertyId}.`);

    } catch (error) {
      console.error(`[ImagesService] Error al eliminar imagen de galería ${imageId} de propiedad ${propertyId}:`, error);
      throw new InternalServerErrorException('No se pudo eliminar la imagen de galería.');
    }
  }

  async findOneWithPropertyAndOwner(id: string): Promise<Images | null> {
    return await this.imageRepository.findOne({
      where: { id },
      relations: [
        'property',
        'property.agency',
        'property.agency.user'
      ],
    });
}

}