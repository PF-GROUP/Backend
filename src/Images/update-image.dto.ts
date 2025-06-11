import { IsOptional, IsString, IsNumber, IsUrl } from 'class-validator';

export class UpdateImageDto {
  @IsString({ message: 'El campo "file" debe ser una cadena de texto.' })
  @IsUrl({}, { message: 'El campo "file" debe ser una URL válida.' })
  @IsOptional()
  file?: string; 

  @IsString({ message: 'El campo "title" debe ser una cadena de texto.' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'El campo "description" debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;


  @IsNumber({}, { message: 'El "propertyId" debe ser un número.' })
  @IsOptional()
  propertyId?: number;
}