
import { PropertyType, PropertyStatus, TransactionType } from './enum';
import { ImageDTO, CreateImageDTO } from './Image'; 

export interface PropertyDTO {
  id: number;
  name: string;
  type_of_property: PropertyType;
  status: PropertyStatus;
  type: TransactionType; // Tipo de transacción (ej. 'rent', 'sell'). Foreign Key al ENUM.
  address: string;
  city: string;
  price: number;
  m2: number;
  images: ImageDTO[];
  bathroom: number;
  description: string;
  rooms: number;
  agencyId: number;
  date: string;
}

export interface CreatePropertyDTO {
  name: string;
  type_of_property: PropertyType;
  status: PropertyStatus;
  type: TransactionType;
  address: string;
  city: string;
  price: number;
  m2: number;
  images: CreateImageDTO[];
  bathroom: number;
  description: string;
  rooms: number;
  agencyId: number;
  date?: string;
}

export interface UpdatePropertyDTO {
  name?: string;
  type_of_property?: PropertyType;
  status?: PropertyStatus;
  type?: TransactionType;
  address?: string;
  city?: string;
  price?: number;
  m2?: number;
  images?: (ImageDTO | CreateImageDTO)[];
  bathroom?: number;
  description?: string;
  rooms?: number;
  agencyId?: number;
  date?: string;
}