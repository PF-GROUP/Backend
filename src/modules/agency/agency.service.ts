import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgencyDto, UpdateAgencyDto } from './agency.dto';
import { Agency } from './agency.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    private readonly userService: UserService,
  ) {}

  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    const user = await this.userService.findOne(createAgencyDto.agentUser);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createAgencyDto.agentUser} not found`,
      );
    }

    const agency = new Agency();
    agency.name = createAgencyDto.name;
    agency.description = createAgencyDto.description;
    agency.document = createAgencyDto.cuit_dni_m;
    agency.id_customization = Number(createAgencyDto.customization);
    if (createAgencyDto.propertyIds?.length > 0) {
      agency.id_property = Number(createAgencyDto.propertyIds[0]);
    }

    agency.user = user;

    return this.agencyRepository.save(agency);
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
      throw new NotFoundException('Agency with ID ${id} not found');
    }

    return agency;
  }

  async findOneByCustomerId(customerId: string): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({
      where: { stripeCustomerId: customerId },
      relations: ['customization', 'properties', 'user'],
    });

    if (!agency) {
      throw new NotFoundException('Agency with ID ${id} not found');
    }
    return agency;
  }
  async findOneByUserId(userId: string): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({
      where: { user: { id: userId } },
      relations: ['customization', 'properties', 'user'],
    });
    if (!agency) {
      throw new NotFoundException('Agency with ID ${id} not found');
    }
    return agency;
  }
  async update(id: string, updateAgencyDto: UpdateAgencyDto): Promise<Agency> {
    const agency = await this.findOne(id);

    if (updateAgencyDto.agentUser) {
      const user = await this.userService.findOne(updateAgencyDto.agentUser);
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateAgencyDto.agentUser} not found`,
        );
      }
      agency.user = user;
    }

    if (updateAgencyDto.name) agency.name = updateAgencyDto.name;
    if (updateAgencyDto.description)
      agency.description = updateAgencyDto.description;
    if (updateAgencyDto.cuit_dni_m)
      agency.document = updateAgencyDto.cuit_dni_m;
    if (updateAgencyDto.customization) {
      agency.id_customization = Number(updateAgencyDto.customization);
    }
    if (updateAgencyDto.propertyIds && updateAgencyDto.propertyIds.length > 0) {
      agency.id_property = Number(updateAgencyDto.propertyIds[0]);
    }

    return this.agencyRepository.save(agency);
  }

  async remove(id: string): Promise<void> {
    const agency = await this.findOne(id);
    await this.agencyRepository.softRemove(agency);
  }

  async existsAgency(id: string): Promise<boolean> {
    const agency = await this.findOne(id);
    return !!agency;
  }

  async updateCustomerId(
    agencyId: string,
    customerId: string,
  ): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({
      where: { id: agencyId },
    });
    if (!agency) {
      throw new NotFoundException(`Agency with ID ${agencyId} not found`);
    }

    agency.stripeCustomerId = customerId;
    return this.agencyRepository.save(agency);
  }
}
