import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from 'src/modules/property/property.entity';
import { SoftDeletableEntity } from 'src/Helpers/softDelete.entity';

@Entity('Images')
export class Images extends SoftDeletableEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false})
    file: string;

    @Column({type: 'varchar', nullable: true})
    publicId:string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne(() => Property, property => property.images, {
    nullable: false,
    onDelete: "CASCADE"
    })
    @JoinColumn({ name: 'property_id' })
    property!: Property;

    @Column({ name: 'property_id'})
    propertyId: string;
}