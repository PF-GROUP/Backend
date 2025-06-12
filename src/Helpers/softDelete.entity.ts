import { DeleteDateColumn } from "typeorm";

export abstract class SoftDeletableEntity {
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}