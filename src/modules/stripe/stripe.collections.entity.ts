import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Agency } from "../agency/agency.entity";


@Entity('suscription')
export class Suscription {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    suscriptionId: string

    @Column()
    status: string

    @Column()
    planId : string

    @Column({
        nullable: true
    })
    currentPeriodEnd? : Date

    @Column()
    createdAt : Date

    @Column()
    updatedAt : Date

    @DeleteDateColumn({
        nullable: true
    })
    deletedAt : Date

    @OneToOne(()=> Agency , (agency: Agency) => agency.suscription, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: 'id_agency'})
    agency: Agency
}