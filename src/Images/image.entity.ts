import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from 'src/Property/property.entity';

@Entity('Images')
export class Images {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    image!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => Property, property => property.images, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'property_id' })
    property!: Property;
}