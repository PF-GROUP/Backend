import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomizationDto } from './create-customization.dto';
import { UpdateCustomizationDto } from './update-customization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customization } from './customization.entity';
import { Repository } from 'typeorm';
import { Agency } from 'src/Agency/agency.entity';

@Injectable()
export class CustomizationService {
  constructor(
    @InjectRepository(Customization)
    private customizationRepository: Repository<Customization>,

    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
  ){}

  async updateByAgencyId(agencyId: string, updateCustomizationDto: UpdateCustomizationDto): Promise<Customization> {
    const customizationUpdate = await this.findOneByAgencyId(agencyId);

    this.customizationRepository.merge(customizationUpdate, updateCustomizationDto)

    return this.customizationRepository.save(customizationUpdate)
    
  }



  async findOneByAgencyId(agencyId: string): Promise<Customization> {
    const agency = await this.agencyRepository.findOne({
      where: {id: agencyId},
      relations: ['customization'],
    });

    if (!agency){
      throw new NotFoundException(`Agencia con ID "${agencyId}" no encontrada.`)
    }

    if (!agency.customization){
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
