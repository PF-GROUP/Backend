import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAgencyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @IsString()
  description?: string | null;

  document: string | null;


  @IsNotEmpty()
  agentUser: string;


  @IsNotEmpty()
  @IsString()
  slug: string
}

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {
  customerId?: string;
  name?: string | undefined;
  description?: string | null;
  customizationId?: number;
  propertiesId?: number;
  onBoarding?: boolean;

}
