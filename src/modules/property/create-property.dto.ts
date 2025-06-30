import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Status } from 'src/Enum/status.enum';
import { Type } from 'src/Enum/type.enum';
import { PropertyTypeName } from '../typeOfProperty/property-type.enum';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  m2: number;

  @IsNotEmpty()
  @IsNumber()
  bathrooms: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  rooms: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  id_images?: string[];

  @IsNotEmpty()
  @IsUUID()
  type_of_property_id: string;

  @IsNotEmpty()
  @IsUUID()
  agency: string;
}
