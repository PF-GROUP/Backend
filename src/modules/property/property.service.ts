/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './create-property.dto';
import { Property } from './property.entity';
import { UpdatePropertyDto } from './update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOfProperty } from '../typeOfProperty/typeofproperty.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(TypeOfProperty)
    private readonly typeOfPropertyRepository: Repository<TypeOfProperty>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    try {
      const typeOfProperty = await this.typeOfPropertyRepository.findOne({
        where: { id: createPropertyDto.type_of_property_id },
      });

      if (!typeOfProperty) {
        throw new NotFoundException(
          `Tipo de propiedad con ID '${createPropertyDto.type_of_property_id}' no encontrado`,
        );
      }

      const property = new Property();
      Object.assign(property, {
        ...createPropertyDto,
        type_of_property: typeOfProperty, // Asignar la relacion
      });

      return await this.propertyRepository.save(property);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear la propiedad: ${error.message}`,
      );
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
      throw new InternalServerErrorException(
        `Error al buscar propiedades: ${error.message}`,
      );
    }
  }

  async findByAgencyId(agencyId: string): Promise<Property[]> {
    try {
      return await this.propertyRepository.find({
        where: { agency: { id: agencyId } },
        relations: ['type_of_property', 'agency', 'images'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener las propiedades de la agencia: ${error.message}`,
      );
    }
  }

  async findOne(
    id: string,
    includeDeleted: boolean = false,
  ): Promise<Property> {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
        relations: ['type_of_property', 'agency', 'images'],
        withDeleted: includeDeleted,
      });

      if (!property) {
        throw new NotFoundException('Propiedad no encontrada');
      }
      return property;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar la propiedad: ${error.message}`,
      );
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
        throw new NotFoundException('Propiedad no encontrada');
      }

      Object.assign(property, updatePropertyDto);
      return await this.propertyRepository.save(property);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la propiedad: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.propertyRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Propiedad no encontrada');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar la propiedad: ${error.message}`,
      );
    }
  }

  async permanentRemove(id: string): Promise<void> {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!property) {
        throw new NotFoundException('Propiedad no encontrada');
      }

      await this.propertyRepository.remove(property);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al eliminar permanentemente la propiedad: ${error.message}`,
      );
    }
  }

  async findOneWithAgencyAndOwner(id: string): Promise<Property | null> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: {
        agency: {
          user: true,
        },
      },

      withDeleted: false,
    });

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }
    return property;
  }
}
