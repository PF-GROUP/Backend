import { CreateCustomizationDto } from './Customization/create-customization.dto';
import { UpdateCustomizationDto } from './Customization/update-customization.dto';
export declare class CustomizationService {
    create(createCustomizationDto: CreateCustomizationDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCustomizationDto: UpdateCustomizationDto): string;
    remove(id: number): string;
}
