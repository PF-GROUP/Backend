import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class CreateImageDto {

  @IsString({ message: 'El campo "file" debe ser una cadena de texto.' })
  @IsUrl({}, { message: 'El campo "file" debe ser una URL válida.' })
  @IsNotEmpty({ message: 'El campo "file" (URL de la imagen) no puede estar vacío.' })
  file!: string;

  @IsString({ message: 'El campo "title" debe ser una cadena de texto.' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'El campo "description" debe ser una cadena de texto.' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El "propertyId" debe ser un número.' })
  @IsNotEmpty({ message: 'El "propertyId" es obligatorio para asociar la imagen a una propiedad.' })
  propertyId!: number;
}