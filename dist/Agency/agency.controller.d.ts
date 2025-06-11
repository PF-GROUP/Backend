import { AgencyService } from './agency.service';
import { CreateAgencyDto } from './create-agency.dto';
export declare class AgencyController {
    private readonly agencyService;
    constructor(agencyService: AgencyService);
    create(createAgencyDto: CreateAgencyDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAgencyDto: UpdateAgencyDto): string;
    remove(id: string): string;
}
