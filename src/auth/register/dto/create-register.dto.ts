import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Role } from 'src/Enum/roles.enum';
import { CustomizationDTO } from 'src/Interface/Customization';
import { UserRole } from 'src/Interface/enum';
import { PropertyDTO } from 'src/Interface/Property';
import { UserDTO } from 'src/Interface/User';

export class CreateRegisterDto {
  // Propiedades del usuario

  @IsString()
  @Length(2, 10, { message: 'El nombre debe tener entre 2 y 10 caracteres' })
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(2, 10, { message: 'El apellido debe tener entre 2 y 10 caracteres' })
  @IsNotEmpty()
  surname: string;

  @IsEmail()
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsMobilePhone()
  @IsNotEmpty({ message: 'El numero de telefono es requerido' })
  phone: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  @IsNotEmpty({ message: 'La contrasena es requerida' })
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  rol: UserRole;

  // Propiedades de la agencia
  @IsString()
  @Length(3, 20, {
    message: 'El nombre de la agencia debe tener entre 3 y 20 caracteres',
  })
  @IsNotEmpty()
  agencyName: string;

  @IsString()
  @MaxLength(100, {
    message: 'La descripcion no puede tener mas de 100 caracteres',
  })
  @IsNotEmpty()
  agencyDescription: string;

  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'El CUIT/DNI debe tener exactamente 11 digitos',
  })
  @IsNotEmpty()
  cuit_dni_m: string;

  // Propiedades opcionales
  @IsOptional()
  customization?: CustomizationDTO;

  @IsOptional()
  properties?: PropertyDTO[];

  @IsOptional()
  agentUser?: UserDTO;
}
