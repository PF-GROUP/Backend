import { Agency } from "src/modules/agency/agency.entity";
import { SoftDeletableEntity } from "src/Helpers/softDelete.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";

@Entity('Customizations')
export class Customization extends SoftDeletableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: true, default: "Logo"})
  logoImage: string;
  
  @Column({nullable: true, default:"Informacion de la agencia"})
  information: string;

  @Column({nullable: true, default:"#000000"})
  mainColors: string;
  
  @Column({nullable: true, default: "Logo"})
  banner: string;

  @Column({nullable: true,default: "#8787FF"})
  navbarColor: string;

  @Column({nullable: true, default: "#8787F2"})
  buttonColor: string;

  @Column({nullable: true, default: "#8787F2"})
  backgroundColor: string;

  @Column({nullable: true, default: "#8787F2"})
  secondaryColor: string;

  @OneToOne(() => Agency, agency => agency.customization, {
    nullable: true,
    onDelete: "SET NULL"
  })
  agency: Agency;

}
