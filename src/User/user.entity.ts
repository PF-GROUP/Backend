import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../Enum/roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;
}
