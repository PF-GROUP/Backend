import { ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateCustomizationDto } from './create-customization.dto';
import { UpdateCustomizationDto } from './update-customization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customization } from './customization.entity';
import { Repository } from 'typeorm';
import { Agency } from 'src/modules/agency/agency.entity';
import { CloudinaryService } from 'src/shared/cloudinary.service';

@Injectable()
export class CustomizationService {
  constructor(
    @InjectRepository(Customization)
    private customizationRepository: Repository<Customization>,

    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async updateByAgencyId(agencyId: string, updateCustomizationDto: UpdateCustomizationDto): Promise<Customization> {
    const customizationUpdate = await this.findOneByAgencyId(agencyId);

    if (updateCustomizationDto.logoImage !== undefined && updateCustomizationDto.logoImage !== customizationUpdate.logoImage) {
      const oldLogoUrl = customizationUpdate.logoImage;

      if (oldLogoUrl) {
        const publicIdToDelete = this.cloudinaryService.getPublicIdFromUrl(oldLogoUrl);
        if (publicIdToDelete) {
          console.log(`Eliminando logo antiguo de Cloudinary con publicId: ${publicIdToDelete}`);
          await this.cloudinaryService.deleteFile(publicIdToDelete);
        } else {
          console.warn(`No se pudo extraer publicId del logo antiguo: ${oldLogoUrl}. No se eliminó de Cloudinary.`);
        }
      }
    }

    if (updateCustomizationDto.banner !== undefined && updateCustomizationDto.banner !== customizationUpdate.banner) {
      const oldBannerUrl = customizationUpdate.banner;

      if (oldBannerUrl) {
        const publicIdToDelete = this.cloudinaryService.getPublicIdFromUrl(oldBannerUrl);
        if (publicIdToDelete) {
          console.log(`Eliminando banner antiguo de Cloudinary con publicId: ${publicIdToDelete}`);
          await this.cloudinaryService.deleteFile(publicIdToDelete);
        } else {
          console.warn(`No se pudo extraer publicId del banner antiguo: ${oldBannerUrl}. No se eliminó de Cloudinary.`);
        }
      }
    }

    this.customizationRepository.merge(customizationUpdate, updateCustomizationDto);

    try {
      return this.customizationRepository.save(customizationUpdate);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar la personalización en la base de datos.');
    }
  }

  async findOneByAgencyId(agencyId: string): Promise<Customization> {
    const agency = await this.agencyRepository.findOne({
      where: { id: agencyId },
      relations: ['customization'],
    });

    if (!agency) {
      throw new NotFoundException(`Agencia con ID "${agencyId}" no encontrada.`);
    }

    if (!agency.customization) {
      throw new NotFoundException(`La agencia con ID "${agencyId}" no tiene una personalización asociada.`);
    }

    return agency.customization;
  }

  async create(
    createCustomizationDto: CreateCustomizationDto,
    agencyId: string,
  ): Promise<Customization> {
    const agency = await this.agencyRepository.findOne({
      where: { id: agencyId },
      relations: ['customization'],
    });

    if (!agency) {
      throw new NotFoundException(`Agencia con ID "${agencyId}" no encontrada.`);
    }

    if (agency.customization) {
      throw new ConflictException(`La agencia ya tiene una personalización. Utiliza el metodo para actualizarla.`);
    }

    const newCustomization = this.customizationRepository.create(createCustomizationDto);

    const savedCustomization = await this.customizationRepository.save(newCustomization);

    agency.customization = savedCustomization;

    await this.agencyRepository.save(agency);

    return savedCustomization;
  }

}