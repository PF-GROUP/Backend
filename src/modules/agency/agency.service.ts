import { Injectable } from '@nestjs/common';
import { CreateAgencyDto } from './create-agency.dto';


@Injectable()
export class AgencyService {
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
