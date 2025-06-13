import { UserRole } from 'src/Interface/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('register')
export class Register {
  @PrimaryGeneratedColumn()
  id: number;

  // Propiedades del usuario

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  rol: UserRole;

  // Propiedades de la agencia

  @Column()
  agencyName: string;

  @Column()
  agencyDescription: string;

  @Column()
  cuit_dni_m: string;
}
