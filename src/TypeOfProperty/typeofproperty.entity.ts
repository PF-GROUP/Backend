import { Column, Entity,  PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TypeOfProperty {

@PrimaryGeneratedColumn()
id: number

@Column({type: "varchar", length:"50"})
type: string

 @OneToMany(()=> Property, (property)=> property.typeofproperty)
    property
    
}



