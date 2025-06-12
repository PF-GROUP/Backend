import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from 'src/Property/property.entity';

@Entity('media')
export class Media {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    image!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => Property, property => property.media, {
        onDelete: 'CASCADE', // Si la Property se elimina, las Media asociadas también se eliminan
        nullable: false,
    })
    @JoinColumn({ name: 'propertyId' })
    property!: Property;
}