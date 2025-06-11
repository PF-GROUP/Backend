import { PropertyService } from './Property/property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    create(createPropertyDto: CreatePropertyDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updatePropertyDto: UpdatePropertyDto): any;
    remove(id: string): any;
}
