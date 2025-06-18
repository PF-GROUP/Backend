import { Injectable } from '@nestjs/common';
import { CreateAgencyDto } from './create-agency.dto';


@Injectable()
export class AgencyService {
  async getAgency(page: number, limit: number) {
    let agency = await this.agencyRepository.find
  }
  create(createAgencyDto: CreateAgencyDto) {
    return 'This action adds a new agency';
  }

  findAll() {
    return `This action returns all agency`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agency`;
  }

  update(id: number, updateAgencyDto: CreateAgencyDto) {
    return `This action updates a #${id} agency`;
  }

  remove(id: number) {
    return `This action removes a #${id} agency`;
  }
}
