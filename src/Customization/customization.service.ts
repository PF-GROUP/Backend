import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomizationDTO } from 'src/Interface/Customization';
import { UpdateCustomizationDto } from 'src/modules/customization/update-customization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customization } from './customization.entity';
import { Repository } from 'typeorm';
import { Agency } from 'src/modules/agency/agency.entity';

@Injectable()
export class CustomizationService {
  constructor(
    @InjectRepository(Customization)
    private customizationRepository: Repository<Customization>,

    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
  ){}

  async updateByAgencyId(Id: string, updateCustomizationDto: UpdateCustomizationDto): Promise<Customization> {
    const customizationUpdate = await this.findOneByAgencyId(Id);

    this.customizationRepository.merge(customizationUpdate, updateCustomizationDto)

    return this.customizationRepository.save(customizationUpdate)
    
  }



  async findOneByAgencyId(Id: string): Promise<Customization> {
    const agency = await this.agencyRepository.findOne({
      where: {id: Id},
      relations: ['customization'],
    });

    if (!agency){
      throw new NotFoundException(`Agencia con ID "${Id}" no encontrada.`)
    }

    if (!agency.customization){
      throw new NotFoundException(`La agencia con ID "${Id}" no tiene una personalización asociada.`);
    }

    return agency.customization;
  }



    async create(
    createCustomizationDto: CreateCustomizationDTO,
    Id: string,
  ): Promise<Customization> {
    const agency = await this.agencyRepository.findOne({
      where: { id: Id },
      relations: ['customization'],
    });

    if (!agency) {
      throw new NotFoundException(`Agencia con ID "${Id}" no encontrada.`);
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
