import { Agency } from "src/modules/agency/agency.entity";
import { SoftDeletableEntity } from "src/Helpers/softDelete.entity";
import { Column, Entity,  OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "User"
})
export class User extends SoftDeletableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "varchar",
        length: 150,
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

    @Column({
        type: "varchar",
        nullable: true,
        default: null,
    })
    profilePictureUrl: string | null;
    
    @Column({
        type: "boolean",
        default: false,
    })
    newsletter: boolean;
    
    @OneToOne(()=> Agency , (agency: Agency) => agency.user,
{
    onDelete: "SET NULL",
    nullable: true
  })
    agency?: Agency | null;
}

