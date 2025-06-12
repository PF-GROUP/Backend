import { Property } from 'src/Property/property.entity';
import { User } from 'src/User/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';

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

  @ManyToOne(()=> User, (user:User)=> user.appointment)
  @JoinColumn({name:'user_id'})
  user: User

  @ManyToOne(()=> Property, (property:Property)=> property.appointment)
  @JoinColumn({name:'property_id'})
  property: Property
}
