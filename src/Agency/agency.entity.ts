import { Customization } from 'src/Customization/customization.entity';
import { Property } from 'src/Property/property.entity';
import { User } from 'src/User/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'Agency',
})
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 400,
    nullable: false,
  })
  description: string;

  @ManyToOne(() => Customization, (customization) => customization.agencies, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_customization' })
  customization: Customization | null;
  id_customization: number;

  @OneToMany(() => Property, (property) => property.agency)
  properties: Property[];
  id_property: number;

  @ManyToOne(() => User, (user) => user.managedAgencies)
  @JoinColumn({ name: 'id_user' })
  adminUser: User;
  id_user: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  document: string;
}
