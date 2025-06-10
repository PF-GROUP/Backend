
/**
 * Interface para la entidad 'Customization' (Personalización de la página de la agencia).
 * Representa la estructura de la personalización visual de una agencia.
 */
export interface CustomizationDTO {
  id: number;
  logoImage: string;
  information: string;
  mainColors: string;
  banner: string;
  navbarColor: string;
  buttonColor: string;
  backgroundColor: string;
  secondaryColor: string;
}


export interface CreateCustomizationDTO {
  logoImage: string;
  information: string;
  mainColors: string;
  banner: string;
  navbarColor: string;
  buttonColor: string;
  backgroundColor: string;
  secondaryColor: string;
}