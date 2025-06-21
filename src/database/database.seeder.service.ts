import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOfProperty } from '../modules/typeOfProperty/typeofproperty.entity';
import { Agency } from '../modules/agency/agency.entity';
import { Property } from '../modules/property/property.entity';
import { User } from '../modules/user/user.entity';
import { Images } from '../modules/images/image.entity';
import * as bcrypt from 'bcrypt';
import { Status } from '../Enum/status.enum';
import { Type } from '../Enum/type.enum';
import { PropertyTypeName } from '../modules/typeOfProperty/property-type.enum';

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    console.log(process.env.SEEDER_ENABLED);
    if (process.env.SEEDER_ENABLED === 'true') {
      await this.seed();
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async getPropertyType(queryRunner: any, type: string) {
    const typeRepo = queryRunner.manager.getRepository(TypeOfProperty);
    return await typeRepo.findOne({ where: { type } });
  }

  private async seedPropertyTypes(queryRunner: any) {
    const propertyTypeRepository =
      queryRunner.manager.getRepository(TypeOfProperty);

    // Get all enum values
    const propertyTypes = Object.values(PropertyTypeName);

    // Crear TypeOfProperty entities para cada valor de enum
    const propertyTypeEntities = propertyTypes.map((type) => {
      const entity = new TypeOfProperty();
      entity.type = type;
      return entity;
    });

    // Guardar todos los tipos de propiedad en una sola transaccion
    await propertyTypeRepository.save(propertyTypeEntities);
    console.log(`Seeded ${propertyTypeEntities.length} property types`);
  }

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('Starting database seeding...');

      // Clear existing data
      await queryRunner.query(
        'TRUNCATE TABLE "Images" RESTART IDENTITY CASCADE;',
      );
      await queryRunner.query(
        'TRUNCATE TABLE "Property" RESTART IDENTITY CASCADE;',
      );
      await queryRunner.query(
        'TRUNCATE TABLE "Appointment" RESTART IDENTITY CASCADE;',
      );
      await queryRunner.query(
        'TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;',
      );
      await queryRunner.query(
        'TRUNCATE TABLE "Agency" RESTART IDENTITY CASCADE;',
      );
      await queryRunner.query(
        'TRUNCATE TABLE "TypeOfProperty" RESTART IDENTITY CASCADE;',
      );

      console.log('Existing data cleared.');

      // Seeder de tipos de propiedad
      await this.seedPropertyTypes(queryRunner);

      // Seeder de agencias
      const agencyRepo = queryRunner.manager.getRepository(Agency);
      const agenciesToCreate = [
        {
          name: 'Luxury Estates',
          description: 'Premier properties y servicios real estate.',
          document: '1234567890',
        },
        {
          name: 'Dream Homes',
          description: 'La casa de tus sueños.',
          document: '0987654321',
        },
        {
          name: 'Prime Properties',
          description: 'Exelencia en real estate.',
          document: '1122334455',
        },
      ];
      const createdAgencies = agenciesToCreate.map((data) =>
        agencyRepo.create(data),
      );
      const agencies = await agencyRepo.save(createdAgencies);
      console.log(`Seeded ${agencies.length} Agency records.`);

      // Seeder de usuarios con contraseñas hasheadas
      const userRepo = queryRunner.manager.getRepository(User);
      const usersToCreate = [
        {
          name: 'Mark',
          surname: 'Julien',
          phone: '+1234567890',
          email: 'mark.julien@example.com',
          password: await this.hashPassword('password123'),
          rol: 0, // Asumiendo que 0 es Admin y que 1 es Agent
          agency: agencies[0], // Associate user con la agency en la creacion
        },
        {
          name: 'Jane',
          surname: 'Smith',
          phone: '+1987654321',
          email: 'jane.smith@example.com',
          password: await this.hashPassword('password123'),
          rol: 1, // Asumiendo que 1 es Agent
          agency: agencies[1],
        },
        {
          name: 'Tom',
          surname: 'Clancy',
          phone: '+1122334455',
          email: 'tom.clancy@example.com',
          password: await this.hashPassword('admin123'),
          rol: 0, // Asumiendo que 0 es Admin
          agency: agencies[2],
        },
      ];
      const createdUsers = usersToCreate.map((data) => userRepo.create(data));
      const users = await userRepo.save(createdUsers);
      console.log(`Seeded ${users.length} User records.`);

      // Asignar los usuarios a las agencias
      agencies[0].user = users[0];
      agencies[1].user = users[1];
      agencies[2].user = users[2];
      await agencyRepo.save(agencies);
      console.log('Agencias actualizadas con relaciones de usuario.');

      // Seeder de las propiedades
      const propertyRepo = queryRunner.manager.getRepository(Property);
      const propertiesToCreate = [
        {
          name: 'Apartamento moderno downtown',
          status: Status.Disponible,
          type: Type.Alquiler,
          address: '123 Main St',
          city: 'New York',
          price: 2500,
          m2: 85,
          bathrooms: 1,
          description:
            'Hermoso apartamento moderno en el corazón de la ciudad con excelentes vistas',
          rooms: 2,
          type_of_property: await this.getPropertyType(
            queryRunner,
            PropertyTypeName.DEPARTAMENTO,
          ),
          agency: agencies[0],
        },
        {
          name: 'Chalet de lujo con piscina',
          status: Status.Disponible,
          type: Type.Venta,
          address: '456 Ocean View',
          city: 'Miami',
          price: 1250000,
          m2: 320,
          bathrooms: 4,
          description:
            'Hermoso chalet de lujo con piscina y vistas panorámicas.',
          rooms: 5,
          type_of_property: await this.getPropertyType(
            queryRunner,
            PropertyTypeName.CHALET,
          ),
          agency: agencies[1],
        },
        {
          name: 'Casa familiar acogedora',
          status: Status.Vendido,
          type: Type.Alquiler,
          address: '789 Park Ave',
          city: 'Los Angeles',
          price: 850000,
          m2: 180,
          bathrooms: 2,
          description:
            'Encantadora casa familiar con jardín en un barrio tranquilo',
          rooms: 3,
          type_of_property: await this.getPropertyType(
            queryRunner,
            PropertyTypeName.CASA,
          ),
          agency: agencies[2],
        },
      ];

      const createdProperties = propertiesToCreate.map((data) =>
        propertyRepo.create(data),
      );
      const properties = await propertyRepo.save(createdProperties);
      console.log(`Seeded ${properties.length} Property records.`);

      // Seeder de imágenes
      const imagesRepo = queryRunner.manager.getRepository(Images);
      const imagesToCreate: Partial<Images>[] = [
        {
          file: 'https://example.com/property1_img1.jpg',
          title: 'Sala de estar',
          description: 'Sala de estar amplia',
          property: properties[0],
        },
        {
          file: 'https://example.com/property1_img2.jpg',
          title: 'Apartamento',
          description: 'Cocina moderna con electrodomésticos',
          property: properties[0],
        },
        {
          file: 'https://example.com/property2_img1.jpg',
          title: 'Chalet',
          description: 'Vista panorámica del chalet',
          property: properties[1],
        },
        {
          file: 'https://example.com/property3_img1.jpg',
          title: 'Jardín',
          description: 'Jardín con piscina',
          property: properties[2],
        },
      ];

      const createdImages = imagesToCreate.map((data) =>
        imagesRepo.create(data),
      );
      const images = await imagesRepo.save(createdImages);
      console.log(`Seeded ${images.length} Image logs.`);

      await queryRunner.commitTransaction();
      console.log('✅ Base de datos seeded exitosamente!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error al seedear la base de datos:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
