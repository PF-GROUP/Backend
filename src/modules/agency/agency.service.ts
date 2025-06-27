import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { CreateAgencyDto, UpdateAgencyDto } from './agency.dto';
import { Agency } from './agency.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    const user = await this.userService.findOne(createAgencyDto.agentUser);
    const agency = new Agency();

    agency.name = createAgencyDto.name;
    agency.description = createAgencyDto.description;
    agency.document = createAgencyDto.document;
    agency.id_customization = null;
    agency.slug = createAgencyDto.slug;
    agency.user = user;

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
    if (!updateAgencyDto.agentUser)
      throw new NotFoundException('User not found');
    if (updateAgencyDto.name) agency.name = updateAgencyDto.name;
    if (updateAgencyDto.description)
      agency.description = updateAgencyDto.description;
    if (updateAgencyDto.document) agency.document = updateAgencyDto.document;

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
    if (updateAgencyDto.document) agency.document = updateAgencyDto.document;

    return this.agencyRepository.save(agency);
  }

  async remove(id: string): Promise<void> {
    const result = await this.agencyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agencia con ID ${id} no encontrada`);
    }
  }

  async softRemove(id: string): Promise<Agency | null> {
    const agency = await this.agencyRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!agency) {
      throw new NotFoundException('Agencia no encontrada');
    }

    // Si ya esta eliminada logicamente, la restaura
    if (agency.deletedAt) {
      await this.agencyRepository.restore({ id });
      return this.agencyRepository.findOne({
        where: { id },
        withDeleted: true,
      });
    }

    // Si no esta eliminada logicamente, la elimina
    await this.agencyRepository.softRemove(agency);
    return this.agencyRepository.findOne({
      where: { id },
      withDeleted: true,
    });
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

  async updateAgencyNameAndDescription(
    id: string,
    updateAgencyDto: { name?: string; description?: string | null },
  ): Promise<Agency> {
    const agency = await this.findOne(id);
    if (!agency) {
      throw new NotFoundException(`Agencia con id ${id} no encontrada`);
    }
    if (updateAgencyDto.name) {
      agency.name = updateAgencyDto.name;
    }
    if (updateAgencyDto.description) {
      agency.description = updateAgencyDto.description;
    }
    return await this.agencyRepository.save(agency);
  }

  async findOneBySlug(slug: string): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({
      where: { slug },
      relations: ['customization', 'properties', 'user', 'properties.images'],
    });

    if (!agency) {
      throw new NotFoundException(`Agencia con slug '${slug}' no encontrada`);
    }

    return agency;
  }
  // Buscar agencias eliminadas logicamente
  async findRemoved(): Promise<Agency[]> {
    return this.agencyRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
      relations: ['customization', 'properties', 'user'],
    });
  }
}
