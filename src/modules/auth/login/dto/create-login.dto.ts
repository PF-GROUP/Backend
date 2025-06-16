// export class CreateLoginDto {
//   readonly email: string;
//   readonly password: string;
// }
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6) // Por ahora minimo de 6 caracteres
  password: string;
}