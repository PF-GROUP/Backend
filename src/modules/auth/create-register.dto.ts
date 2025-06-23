
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRegisterDto {
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

  // @IsNotEmpty()
  // @IsString()
  // agencyName: string;

  // @IsNotEmpty()
  // @IsString()
  // agencyDescription: string;

  // @IsOptional()
  // @IsString()
  // document?: string;
}

export class createUserAndAgencyDto extends CreateRegisterDto{

  agencyName: string;

  agencyDescription: string | null;

  document: string | null;

  slug: string
}

export class createUserAndAgencyWithGoogleDto extends createUserAndAgencyDto{
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  googleId: string
}
