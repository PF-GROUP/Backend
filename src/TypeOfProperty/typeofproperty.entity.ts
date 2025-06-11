import { Property } from "src/Property/property.entity";
import { Column, Entity,  OneToMany,  PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TypeOfProperty {

@PrimaryGeneratedColumn()
id: number

@Column({type: "varchar", length:"50"})
type: string

 @OneToMany(()=> Property, (property: Property)=> property.typeofproperty)
    property: Property[]

}



