import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsNumber } from 'class-validator';


export class CreateAppointmentDto {


  @IsNotEmpty()
  @IsString()
  day: string; 

  @IsNotEmpty()
  @IsString()
  time: number; 

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
  @IsString() 
  @IsEmail()
  email: string; 

  @IsNotEmpty()
  @IsString()
  @IsNumber()
  phone: number; 
}
