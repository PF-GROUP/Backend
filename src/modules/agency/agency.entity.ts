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
import { Suscription } from '../stripe/stripe.collections.entity';
import { v4 as uuid } from "uuid"

@Entity({
  name: 'Agency',
})
export class Agency extends SoftDeletableEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string = uuid();

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 400,
    nullable: true,
  })
  description?: string  | null;

  @ManyToOne(() => Customization, (customization) => customization, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({ name: 'id_customization' })
  customization: Customization | null;
  id_customization: number | null;

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
    type: 'varchar',
    nullable: true,
  })
  document: string | null;

  @Column({
    type: 'boolean',
    default:true,
    nullable: true,
  })
  onBoarding:boolean;
  
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  slug: string;

  @Column({ nullable: true, name: 'stripe_customer_id', type: 'varchar' }) // 🆕 Nueva columna
  stripeCustomerId?: string | null; // Almacena el customerId de Stripe

  @OneToOne(() => Suscription, (suscription) => suscription.agency, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({ name: 'id_suscription' })
  suscription?: Suscription | null;
}
