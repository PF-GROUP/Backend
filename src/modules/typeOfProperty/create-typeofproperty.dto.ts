import { IsIn, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { PropertyTypeName } from "./property-type.enum";

export class CreateTypeOfPropertyDto {
      @IsString({message: 'el tipo debe ser un texto. '})
      @IsNotEmpty({message: 'no debe estar el campo vacio. '})
      @MaxLength(50, {message: 'no debe exceder 50 caracteres. '})
      type: PropertyTypeName;
}