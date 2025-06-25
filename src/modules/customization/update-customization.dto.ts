import { IsOptional, IsString, IsHexColor, IsUrl } from 'class-validator';

export class UpdateCustomizationDto {
  @IsUrl({}, { message: 'logoImage debe ser un URL valido.' })
  @IsOptional()
  logoImage?: string;

  @IsString({ message: 'information debe ser una cadena de texto.' })
  @IsOptional()
  information?: string;

  @IsHexColor({ message: 'mainColors debe ser un color hexadecimal válido.' })
  @IsOptional()
  mainColors?: string;

  @IsUrl({}, { message: 'logoImage debe ser un URL valido.' })
  @IsOptional()
  banner?: string;

  @IsHexColor({ message: 'navbarColor debe ser un color hexadecimal válido.' })
  @IsOptional()
  navbarColor?: string;

  @IsHexColor({ message: 'buttonColor debe ser un color hexadecimal válido.' })
  @IsOptional()
  buttonColor?: string;

  @IsHexColor({ message: 'backgroundColor debe ser un color hexadecimal válido.' })
  @IsOptional()
  backgroundColor?: string;

  @IsHexColor({ message: 'secondaryColor debe ser un color hexadecimal válido.' })
  @IsOptional()
  secondaryColor?: string;
}