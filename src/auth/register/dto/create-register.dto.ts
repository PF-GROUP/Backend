import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  // User fields
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  // Agency fields
  @IsNotEmpty()
  @IsString()
  agencyName: string;

  @IsNotEmpty()
  @IsString()
  agencyDescription: string;

  @IsOptional()
  @IsString()
  document?: string;
}
