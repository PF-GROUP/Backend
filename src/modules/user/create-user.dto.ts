import { UserRole } from "src/Interface/enum";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength,  } from "class-validator";

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
      @IsNumber()
      phone: number;

      @IsNotEmpty()
      @IsString()
      @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]{8,}$/, {
      message:
      'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial (!@#$%^&)',
      })
      @MinLength(8)
      @MaxLength(15)
      password: string;

      @IsNotEmpty()
      rol: UserRole;
}
