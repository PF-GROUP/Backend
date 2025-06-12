import { Agency } from "src/Agency/agency.entity";
import { Appointment } from "src/Appointment/appointment.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "User"
})
export class User {
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
        nullable: false,
    })
    phone: string;

    @Column({
        type: "varchar",
        length: 50,
        nullable: false,
    })
    email: string;

    
    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
    })
    password: string;

    @Column({
        type: "boolean",
        default: false,
    }) 
    isAdmin: boolean;

    @OneToMany(() => Appointment, (appointment: Appointment) => appointment) 
     appointment: Appointment[];
    
    @OneToOne(()=> Agency , (agency: Agency) => agency.user)
    @JoinColumn({name: 'id_agency'})
    agency: Agency
}

