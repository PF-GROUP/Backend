import { CustomizationDTO } from "src/Interface/Customization";
import { PropertyDTO } from "src/Interface/Property";
import { UserDTO } from "src/Interface/User";

export class CreateAgencyDto {
  id: number;
  name: string;
  description: string;
  customization: CustomizationDTO;
  properties: PropertyDTO[]; 
  agentUser: UserDTO; 
  cuit_dni_m: string; 

}
