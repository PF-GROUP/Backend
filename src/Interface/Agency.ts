
import { CustomizationDTO, CreateCustomizationDTO } from './Customization';
import { PropertyDTO } from './Property';
import { UserDTO } from './User'; 


export interface AgencyDTO {
  id: number;
  name: string;
  description: string;
  customization: CustomizationDTO;
  properties: PropertyDTO[]; // Foreign Key a 'Property', asumido como un array de propiedades de la agencia. ID property (FK)
  agentUser: UserDTO; // Foreign Key a 'User', ID usuario (agente)'.
  cuit_dni_m: string; // CUIT/DNI/Matrícula de la agencia.
}


export interface CreateAgencyDTO {
  name: string;
  description: string;
  customization?: CreateCustomizationDTO;
  agentUserId: number;
  cuit_dni_m: string;
}