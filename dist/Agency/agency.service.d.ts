import { CreateAgencyDto } from './Agency/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
export declare class AgencyService {
    create(createAgencyDto: CreateAgencyDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAgencyDto: UpdateAgencyDto): string;
    remove(id: number): string;
}
