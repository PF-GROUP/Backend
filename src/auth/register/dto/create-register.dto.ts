import { CustomizationDTO } from 'src/Interface/Customization';
import { UserRole } from 'src/Interface/enum';
import { PropertyDTO } from 'src/Interface/Property';
import { UserDTO } from 'src/Interface/User';

export class CreateRegisterDto {
  // Propiedades del usuario
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  rol: UserRole;

  // Propiedades de la agencia
  agencyName: string;
  agencyDescription: string;
  cuit_dni_m: string;

  // Propiedades opcionales
  customization?: CustomizationDTO;
  properties?: PropertyDTO[];
  agentUser?: UserDTO;
}
