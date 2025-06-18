import { Customization } from 'src/modules/customization/customization.entity';
import { SoftDeletableEntity } from 'src/Helpers/softDelete.entity';
import { Property } from 'src/modules/property/property.entity';
import { User } from 'src/modules/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'Agency',
})
export class Agency extends SoftDeletableEntity{
  @PrimaryGeneratedColumn()
  id: string;

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

  @ManyToOne(() => Customization, (customization) => customization, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({ name: 'id_customization' })
  customization: Customization | null;
  id_customization: number;

  @OneToMany(() => Property, (property) => property.agency,{
    nullable: true,
    onDelete: "SET NULL"
  })
  properties: Property[];
  id_property: number;

  @OneToOne(()=> User, (user: User) => user.agency, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({name: 'id_user'})
  user: User

  @Column({
    type: 'bigint',
    nullable: true,
  })
  document: string;

  @Column({
          type: "varchar",
          nullable: true,
          default: null
      })
      customerId: string | null;
}
