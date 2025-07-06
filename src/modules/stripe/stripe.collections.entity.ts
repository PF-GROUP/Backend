import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Agency } from "../agency/agency.entity";
import { v4 as uuid } from "uuid";

@Entity('Suscription')
export class Suscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  suscriptionId: string;

  @Column()
  status: string;

  @Column()
  planId: string;

  @Column({ nullable: true })
  currentPeriodEnd?: Date;

  @Column({ nullable: true ,
    default: new Date()
  })
  createdAt: Date = new Date();

  @Column()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToOne(() => Agency, (agency: Agency) => agency.suscription, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: 'id_agency' })
  agency: Agency;

  // Aquí sí tiene que ser un array
  @OneToMany(() => Invoice, (invoice: Invoice) => invoice.suscription)
  invoice: Invoice[];  // <-- array, no singular
}

@Entity('Invoice')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  invoiceId: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column()
  suscriptionId: string;

  @ManyToOne(() => Suscription, (suscription: Suscription) => suscription.invoice)
  @JoinColumn({ name: 'id_suscription' })
  suscription: Suscription;
}