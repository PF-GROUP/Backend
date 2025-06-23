
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';

import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { PartialType } from "@nestjs/mapped-types";


export class CreateAgencyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  
  @IsString()
  description?: string | null;


  @IsNotEmpty()
  customization: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  propertyIds: string[];

  @IsNotEmpty()
  agentUser: number;

  @IsNotEmpty()
  @IsString()
  cuit_dni_m: string;


  document: string | null;

  @IsNotEmpty()
  agentUser: number; 

  @IsNotEmpty()
  @IsString()
  slug: string

}

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {
  customerId?: string;
  name?: string | undefined;
  description?: string | undefined;
  customizationId?: number;
  propertiesId?: number;
  onBoarding?: boolean;

}
