import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Images } from './image.entity';
import { Repository } from 'typeorm';
import { Property } from '../property/property.entity';
import { UpdateImageDto } from './update-image.dto';


@Injectable()
export class ImagesService {
 constructor(
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<Images> {
    const { file, propertyId, title, description } = createImageDto;
    const property = await this.propertyRepository.findOneBy({ id: propertyId });
    if (!property) {
      throw new NotFoundException(`Propiedad con ID "${propertyId}" no encontrada. Una imagen debe asociarse a una propiedad existente.`);
    }

    const newImage = this.imagesRepository.create({
      file: file,
      title: title,
      description: description,
      property: property,
      propertyId: propertyId,
    });

    try {
      return await this.imagesRepository.save(newImage);
    } catch (error) {
      throw new InternalServerErrorException('Error al guardar la información de la imagen en la base de datos.');
    }
  }

  async findAll(): Promise<Images[]> {
    return await this.imagesRepository.find({ relations: ['property'] });
  }

  async findOne(id: string): Promise<Images> {
    const image = await this.imagesRepository.findOne({ where: { id }, relations: ['property'] });
    if (!image) {
      throw new NotFoundException(`Imagen con ID "${id}" no encontrada.`);
    }
    return image;
  }

  async update(id: string, updateImageDto: UpdateImageDto): Promise<Images> {
    const imageToUpdate = await this.imagesRepository.findOneBy({ id });
    if (!imageToUpdate) {
      throw new NotFoundException(`Imagen con ID "${id}" no encontrada para actualizar.`);
    }
    
    if (updateImageDto.file !== undefined) {
      imageToUpdate.file = updateImageDto.file;
    }

    if (updateImageDto.propertyId !== undefined) {
      const newProperty = await this.propertyRepository.findOneBy({ id: updateImageDto.propertyId });
      if (!newProperty) {
        throw new BadRequestException(`La nueva propiedad con ID "${updateImageDto.propertyId}" no existe.`);
      }
      imageToUpdate.property = newProperty;
      imageToUpdate.propertyId = newProperty.id;
    }

    imageToUpdate.title = updateImageDto.title ?? imageToUpdate.title;
    imageToUpdate.description = updateImageDto.description ?? imageToUpdate.description;

    try {
      return await this.imagesRepository.save(imageToUpdate);
    } catch (Error) {
      throw new InternalServerErrorException('Error al actualizar la información de la imagen.');
    }
  }

  async remove(id: string): Promise<void> {
    const imageToRemove = await this.imagesRepository.findOneBy({ id });
    if (!imageToRemove) {
      throw new NotFoundException(`Imagen con ID "${id}" no encontrada para eliminar.`);
    }
    await this.imagesRepository.softRemove(imageToRemove);
    }
}