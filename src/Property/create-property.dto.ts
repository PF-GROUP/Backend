import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PropertyStatus } from './property-status.enum';
import { PropertyType } from './property-type.enum';
import { Typeofproperty } from '../TypeOfProperty/typeofproperty.entity';
import { Agency } from '../Agency/agency.entity';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(PropertyStatus)
  status: PropertyStatus;

  @IsNotEmpty()
  @IsEnum(PropertyType)
  type: PropertyType;

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
  @IsString()
  id_images?: string[];

  @IsNotEmpty()
  type_of_property: Typeofproperty;

  @IsNotEmpty()
  agency: Agency;
}