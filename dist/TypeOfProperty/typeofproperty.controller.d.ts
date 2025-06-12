import { TypeofpropertyService } from './typeofproperty.service';
import { CreateTypeofpropertyDto } from './create-typeofproperty.dto';
import { UpdateTypeofpropertyDto } from './dto/update-typeofproperty.dto';
export declare class TypeofpropertyController {
    private readonly typeofpropertyService;
    constructor(typeofpropertyService: TypeofpropertyService);
    create(createTypeofpropertyDto: CreateTypeofpropertyDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTypeofpropertyDto: UpdateTypeofpropertyDto): string;
    remove(id: string): string;
}
