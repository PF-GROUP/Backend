import { Agency } from "src/Agency/agency.entity";
import { SoftDeletableEntity } from "src/Helpers/softDelete.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";

@Entity('Customizations')
export class Customization extends SoftDeletableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  logoImage: string;
  
  @Column({nullable: true})
  information: string;

  @Column({nullable: true})
  mainColors: string;
  
  @Column({nullable: true})
  banner: string;

  @Column({nullable: true})
  navbarColor: string;

  @Column({nullable: true})
  buttonColor: string;

  @Column({nullable: true})
  backgroundColor: string;

  @Column({nullable: true})
  secondaryColor: string;

  @OneToOne(() => Agency, agency => agency.customization, {
    nullable: true,
    onDelete: "SET NULL"
  })
  agency: Agency;

}
