import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Agency } from "src/Agency/agency.entity";

@Entity('customizations')
export class CreateCustomizationDto {
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

  //descomentar cuando este creado la relacion en agencia
  // @OneToOne(() => Agency, agency => agency.customizations)
  // agency: Agency;
}
