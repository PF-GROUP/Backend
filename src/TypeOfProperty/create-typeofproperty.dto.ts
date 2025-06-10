import { PropertyStatus, PropertyType, TransactionType } from "src/Interface/enum";
import { CreateImageDTO } from "src/Interface/Image";

export class CreateTypeofpropertyDto {
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
