import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from 'src/Property/property.entity';
import { SoftDeletableEntity } from 'src/Helpers/softDelete.entity';

@Entity('Images')
export class Images extends SoftDeletableEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    image!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;
    @ManyToOne(() => Property, property => property.images, {
    nullable: true,
    onDelete: "SET NULL"
    })
    @JoinColumn({ name: 'property_id' })
    property!: Property;
}