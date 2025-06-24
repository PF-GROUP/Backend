import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAgencyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  customization: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  propertyIds: string[];

  @IsNotEmpty()
  agentUser: string;

  @IsNotEmpty()
  @IsString()
  cuit_dni_m: string;
}

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {
  customerId?: string;
}
