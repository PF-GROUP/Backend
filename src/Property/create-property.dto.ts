import { PropertyStatus, PropertyType, TransactionType } from "src/Interface/enum";
import { ImageDTO } from "src/Interface/Image";

export class CreatePropertyDto {
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
