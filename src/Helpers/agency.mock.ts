import { User } from '../modules/user/user.entity';
import { Agency } from '../modules/agency/agency.entity';

export const MOCK_USER: User = {
  id: "sd23-sd23-sd23-sd23-sd23",
  name: 'Juan',
  surname: 'Pérez',
  phone: '+5491112345678',
  email: 'juan@inmobiliaria.com',
  password: 'hashedpassword123',
  googleId: null,
  isAdmin: false,
  newsletter: false,
  appointment: [],
  agency: null, 
 deletedAt: null,
 profilePictureUrl: "tumama.com",
}as User;

export const MOCK_AGENCY: Agency = {
  id: "1",
  name: 'Inmobiliaria Ejemplo S.A.',
  description: 'Agencia especializada en propiedades premium',
  customization: null,
  id_customization: 0,
  properties: [],
  id_property: 0,
  onBoarding: false,
  slug:"inmobiliaria-ejemplo-sa",
  stripeCustomerId: "cus_1234567890",
  user: MOCK_USER, // Relación establecida
  document: '30123456789',
  deletedAt: null,
};


MOCK_USER.agency = MOCK_AGENCY; // Establecer la relación inversa