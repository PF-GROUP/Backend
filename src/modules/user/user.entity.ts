import { Agency } from "src/modules/agency/agency.entity";
import { Appointment } from "src/modules/appointment/appointment.entity";
import { SoftDeletableEntity } from "src/Helpers/softDelete.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "User"
})
export class User extends SoftDeletableEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 50,
        nullable: false,
    })
    name: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
    })
    surname: string;

    @Column({
        type: "varchar",
        nullable: true,
    })
    phone?: string;

    @Column({
        type: "varchar",
        length: 50,
        nullable: false,
    })
    email: string;

    
    @Column({
        type: "varchar",
        length: 100,
        nullable: true, // No es obligatorio, ya que se pueden logear con Google
    })
    password?: string;

    @Column({
        type: "boolean",
        default: false,
    }) 
    isAdmin: boolean;

    @Column({
        type: "varchar",
        nullable: true,
        default: null
    })
    googleId: string | null;

    

    @OneToMany(() => Appointment, (appointment: Appointment) => appointment,{
    cascade: true,
    onDelete: "SET NULL"
  }) 
     appointment: Appointment[];
    
    @OneToOne(()=> Agency , (agency: Agency) => agency.user,
{
    onDelete: "SET NULL",
    nullable: true
  })
    @JoinColumn({name: 'id_agency'})
    agency?: Agency | null;
}

