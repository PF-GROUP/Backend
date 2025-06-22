import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePropertyTypeEnum1700000000001 implements MigrationInterface {
  name = 'UpdatePropertyTypeEnum1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('Property');

    if (tableExists) {
      // First, convert the column to text
      await queryRunner.query(`
        ALTER TABLE "Property" 
        ALTER COLUMN "type" TYPE VARCHAR
        USING "type"::VARCHAR
      `);

      // Drop the old enum type if it exists
      await queryRunner.query(`DROP TYPE IF EXISTS "Property_type_enum"`);
      await queryRunner.query(`DROP TYPE IF EXISTS "Property_type_enum_old"`);

      // Create the new enum type
      await queryRunner.query(`
        CREATE TYPE "property_type_enum" AS ENUM ('Alquiler', 'Venta')
      `);

      // Update the values to match the new enum
      await queryRunner.query(`
        UPDATE "Property" 
        SET "type" = CASE 
          WHEN "type" = 'Rent' THEN 'Alquiler'
          WHEN "type" = 'Sale' THEN 'Venta'
          ELSE 'Alquiler'  -- Default fallback
        END
      `);

      // Convert back to the new enum type
      await queryRunner.query(`
        ALTER TABLE "Property" 
        ALTER COLUMN "type" TYPE "property_type_enum" 
        USING "type"::text::"property_type_enum"
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('Property');

    if (tableExists) {
      // Convert to text first
      await queryRunner.query(`
        ALTER TABLE "Property" 
        ALTER COLUMN "type" TYPE VARCHAR
        USING "type"::VARCHAR
      `);

      // Drop the new enum
      await queryRunner.query(`DROP TYPE IF EXISTS "property_type_enum"`);

      // Recreate the old enum
      await queryRunner.query(`
        CREATE TYPE "Property_type_enum" AS ENUM ('Rent', 'Sale')
      `);

      // Update values back to original
      await queryRunner.query(`
        UPDATE "Property" 
        SET "type" = CASE 
          WHEN "type" = 'Alquiler' THEN 'Rent'
          WHEN "type" = 'Venta' THEN 'Sale'
          ELSE 'Rent'  -- Default fallback
        END
      `);

      // Convert back to enum
      await queryRunner.query(`
        ALTER TABLE "Property" 
        ALTER COLUMN "type" TYPE "Property_type_enum" 
        USING "type"::text::"Property_type_enum"
      `);
    }
  }
}
