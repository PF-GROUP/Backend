import { CustomizationService } from './customization.service';
import { CreateCustomizationDto } from './Customization/create-customization.dto';
import { UpdateCustomizationDto } from './Customization/update-customization.dto';
export declare class CustomizationController {
    private readonly customizationService;
    constructor(customizationService: CustomizationService);
    create(createCustomizationDto: CreateCustomizationDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCustomizationDto: UpdateCustomizationDto): string;
    remove(id: string): string;
}
