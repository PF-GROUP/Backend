import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgencyDto, UpdateAgencyDto } from './agency.dto'
import { Agency } from './agency.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    private readonly userService : UserService
  ) {}

  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {

    const user = await this.userService.findOne(createAgencyDto.agentUser.id);
    const agency = new Agency();
    agency.name = createAgencyDto.name;
    agency.description = createAgencyDto.description;
    agency.document = createAgencyDto.cuit_dni_m;
    agency.id_customization = createAgencyDto.customization.id;
    agency.id_property = createAgencyDto.properties[0]?.id;
    agency.user = user; ;

    return await this.agencyRepository.save(agency);
  }

  async findAll(): Promise<Agency[]> {
    return await this.agencyRepository.find({
      relations: ['customization', 'properties', 'user'],
    });
  }

  async findOne(id: string): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({
      where: { id },
      relations: ['customization', 'properties', 'user'],
    });

    if (!agency) {
      throw new NotFoundException("Agency with ID ${id} not found");
    }

    return agency;
  }

  async findOneByCustomerId(customerId: string): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({
      where: { stripeCustomerId: customerId },
      relations: ['customization', 'properties', 'user'],
    })

    if (!agency) {
      throw new NotFoundException("Agency with ID ${id} not found");
    }
    return agency 
  }
  async findOneByUserId(userId: number): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['customization', 'properties', 'user'],
    });
    if (!agency) {
      throw new NotFoundException("Agency with ID ${id} not found");
    }
    return agency
  }
  async update(id: string, updateAgencyDto: UpdateAgencyDto): Promise<Agency> {
    const agency = await this.findOne(id);
    if ( !updateAgencyDto.agentUser ) throw new NotFoundException("User not found");
    const user = await this.userService.findOne(updateAgencyDto.agentUser.id);
    if (updateAgencyDto.name) agency.name = updateAgencyDto.name;
    if (updateAgencyDto.description) agency.description = updateAgencyDto.description;
    if (updateAgencyDto.cuit_dni_m) agency.document = updateAgencyDto.cuit_dni_m;
    if (updateAgencyDto.customization) agency.id_customization = updateAgencyDto.customization.id;
    if (updateAgencyDto.properties) agency.id_property = updateAgencyDto.properties[0]?.id;
    if (updateAgencyDto.agentUser) {
      agency.user = user;
    }

    return await this.agencyRepository.save(agency);
  }

  async remove(id: string): Promise<void> {
    const agency = await this.findOne(id);
    await this.agencyRepository.softRemove(agency);
  }

  async existsAgency(id: string): Promise<boolean> {
    const agency = await this.findOne(id);
    return !!agency;
  }
}