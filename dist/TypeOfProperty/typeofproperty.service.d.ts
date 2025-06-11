import { CreateTypeofpropertyDto } from './create-typeofproperty.dto';
import { UpdateTypeofpropertyDto } from './dto/update-typeofproperty.dto';
export declare class TypeofpropertyService {
    create(createTypeofpropertyDto: CreateTypeofpropertyDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTypeofpropertyDto: UpdateTypeofpropertyDto): string;
    remove(id: number): string;
}
