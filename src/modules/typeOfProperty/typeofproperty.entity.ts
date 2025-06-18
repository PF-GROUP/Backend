import { SoftDeletableEntity } from "src/Helpers/softDelete.entity";
import { Property } from "src/modules/property/property.entity";
import { Column, Entity,  OneToMany,  PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'TypeOfProperty'})
export class TypeOfProperty extends SoftDeletableEntity {

@PrimaryGeneratedColumn('uuid')
id: string

@Column({type: "varchar", length:"50", unique: true})
type: string

 @OneToMany(()=> Property, (property: Property)=> property.type_of_property,{
    cascade: true,
    onDelete: "SET NULL"
  })
    property: Property[]

}



