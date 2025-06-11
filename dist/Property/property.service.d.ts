import { CreatePropertyDto } from './create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
export declare class PropertyService {
    create(createPropertyDto: CreatePropertyDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePropertyDto: UpdatePropertyDto): string;
    remove(id: number): string;
}
