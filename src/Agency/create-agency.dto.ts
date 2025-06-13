import { CustomizationDTO } from "src/Interface/Customization";
import { PropertyDTO } from "src/Interface/Property";
import { UserDTO } from "src/Interface/User";
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateAgencyDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  customization: CustomizationDTO;

  @IsNotEmpty()
  properties: PropertyDTO[]; 

  @IsNotEmpty()
  agentUser: UserDTO; 

  @IsNotEmpty()
  @IsString()
  cuit_dni_m: string; 

}
