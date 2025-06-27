/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTypeOfPropertyDto } from './create-typeofproperty.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOfProperty } from './typeofproperty.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeofpropertyService {
  constructor(
    @InjectRepository(TypeOfProperty)
    private readonly typeOfPropertyRepository: Repository<TypeOfProperty>
  ){}

  async create(createTypeOfPropertyDto: CreateTypeOfPropertyDto): Promise<TypeOfProperty> {
    const existingType = await this.typeOfPropertyRepository.findOne({
      where:{
        type: createTypeOfPropertyDto.type,
      },
      withDeleted: false,
    });
    if (existingType){
      throw new ConflictException(`El tipo de propiedad "${createTypeOfPropertyDto.type}" ya existe.`);
    }

    const newType = this.typeOfPropertyRepository.create(createTypeOfPropertyDto);
    return await this.typeOfPropertyRepository.save(newType);
  }

  async findAll(): Promise<TypeOfProperty[]> {
    return await this.typeOfPropertyRepository.find();
  }

  async findOne(id: string): Promise<TypeOfProperty> {
    const type = await this.typeOfPropertyRepository.findOneBy({ id });
    if (!type) {
      throw new NotFoundException(`Tipo de propiedad con ID "${id}" no encontrado.`);
    }
    return type;
    }

  async update(id: string, updateTypeofpropertyDto: CreateTypeOfPropertyDto): Promise<TypeOfProperty> {
    const typeToUpdate = await this.typeOfPropertyRepository.findOneBy({ id });

    if (!typeToUpdate) {
      throw new NotFoundException(`Tipo de propiedad con ID "${id}" no encontrado para actualizar.`);
    }

    this.typeOfPropertyRepository.merge(typeToUpdate, updateTypeofpropertyDto);
    
  try{
    return await this.typeOfPropertyRepository.save(typeToUpdate);
  } catch (error){
    if (error.code === '23505' || (error.message && error.message.includes('duplicate key value'))) {
            throw new ConflictException(`El tipo de propiedad "${updateTypeofpropertyDto.type}" ya existe.`);
        }
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Tipo de propiedad con ID "${id}" no encontrado para actualizar.`);
        }  
        throw new InternalServerErrorException(`Error al actualizar el tipo de propiedad: ${error.message}`);
  }
  }
}
