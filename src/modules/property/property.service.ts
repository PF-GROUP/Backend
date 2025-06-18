import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './create-property.dto';
import { Property } from './property.entity';
import { UpdatePropertyDto } from './update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      const property = new Property();
      Object.assign(property, createPropertyDto);

      return await this.propertyRepository.save(property);
    } catch (error) {
      throw new Error(`Error al crear la propiedad: ${error.message}`);
    }
  }

  async findAll(includeDeleted: boolean = false): Promise<Property[]> {
    try {
      const options = {
        relations: ['type_of_property', 'agency', 'images'],
        withDeleted: includeDeleted,
      };
      return await this.propertyRepository.find(options);
    } catch (error) {
      throw new Error(`Error al buscar propiedades: ${error.message}`);
    }
  }

  async findOne(
    id: string,
    includeDeleted: boolean = false,
  ): Promise<Property> {
    try {
      const options = {
        where: { id },
        relations: ['type_of_property', 'agency', 'images'],
        withDeleted: includeDeleted,
      };

      const property = await this.propertyRepository.findOne(options);

      if (!property) {
        throw new Error('Propiedad no encontrada');
      }
      return property;
    } catch (error) {
      throw new Error(`Error al buscar la propiedad: ${error.message}`);
    }
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
      });

      if (!property) {
        throw new Error('Propiedad no encontrada');
      }

      // Actualizamos solo los campos proporcionados
      Object.assign(property, updatePropertyDto);
      return await this.propertyRepository.save(property);
    } catch (error) {
      throw new Error(`Error al actualizar la propiedad: ${error.message}`);
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} property`;
  // }
}
