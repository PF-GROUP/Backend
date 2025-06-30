import { UserRole } from "src/Interface/enum";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { OmitType } from "@nestjs/mapped-types";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)      
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  surname: string;

  @IsNotEmpty()
  @IsEmail()  
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'El número de teléfono debe tener entre 10 y 15 dígitos'
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial (!@#$%^&)',
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @IsNotEmpty()
  rol: UserRole;

}

export class createGoogleUserDto extends OmitType(CreateUserDto, ['password','phone']) {
  googleId: string;
}
export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial (!@#$%^&)',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial (!@#$%^&)',
  })
  confirmPassword: string;
}