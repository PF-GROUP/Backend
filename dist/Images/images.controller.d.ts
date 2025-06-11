import { ImagesService } from './images.service';
import { CreateImageDto } from './Images/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    create(createImageDto: CreateImageDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateImageDto: UpdateImageDto): string;
    remove(id: string): string;
}
