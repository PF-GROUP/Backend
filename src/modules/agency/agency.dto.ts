import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsOptional,
} from 'class-validator';
import { PartialType } from "@nestjs/mapped-types";

export class CreateAgencyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsString()
  customization?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  propertyIds?: string[];

  @IsNotEmpty()
  agentUser: string;

  @IsOptional()
  @IsString()
  cuit_dni_m?: string;

  @IsOptional()
  document: string | null;

  @IsNotEmpty()
  @IsString()
  slug: string;
}

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {
  customerId?: string;
  name?: string | undefined;
  description?: string | undefined;
  customizationId?: number;
  propertiesId?: number;
  onBoarding?: boolean;
}
