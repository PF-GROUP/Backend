import { CreateImageDto } from './Images/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
export declare class ImagesService {
    create(createImageDto: CreateImageDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateImageDto: UpdateImageDto): string;
    remove(id: number): string;
}
