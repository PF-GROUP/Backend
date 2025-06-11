import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Typeofproperty } from '../TypeOfProperty/typeofproperty.entity';
import { PropertyStatus } from './property-status.enum';
import { Image } from 'src/Images/image.entity';
import { PropertyType } from './property-type.enum';
import { Agency } from 'src/Agency/agency.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('enum', { enum: PropertyStatus })
  status: PropertyStatus;

  @Column('enum', { enum: PropertyType })
  type: PropertyType;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  price: number;

  @Column()
  m2: number;

  @Column()
  bathrooms: number;

  @Column()
  description: string;

  @Column()
  rooms: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Image, (image) => image.property) // Relacion con la tabla de imagenes con array
  id_images: Image[];

  @ManyToOne(() => Typeofproperty, (type) => type.properties) // Relacion con la tabla de tipo de propiedad
  @JoinColumn({ name: 'type_of_property_id' })
  type_of_property: Typeofproperty;

  @ManyToOne(() => Agency, (agency) => agency.properties) // Relacion con la tabla de agencia
  @JoinColumn({ name: 'agency_id' })
  agency: Agency;
}