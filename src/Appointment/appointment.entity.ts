import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({
  name:'Appointment'})

export class Appointment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  day: Date;

  @Column()
  time: string; 

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  phone: string;


}
