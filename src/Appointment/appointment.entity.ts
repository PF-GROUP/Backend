import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppointmentStatus } from './appointment-status.enum';

export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  propertyId: string;

  @Column()
  propertyType: string; // 'Casa' | 'Departamento' | 'Comercial' | etc.

  @Column()
  clientId: string;

  @Column()
  clientName: string;

  @Column()
  clientPhone: string;

  @Column('date')
  appointmentDate: Date;

  @Column('time')
  appointmentTime: string;

  @Column('enum', { enum: AppointmentStatus })
  status: AppointmentStatus; // 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

  @Column('text')
  appointmentPurpose: string; // 'Visitar' | 'Inspeccion' | 'Reunion' | etc.

  @Column('text', { nullable: true })
  notes?: string;

  @Column('text', { nullable: true })
  preferredLanguage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
