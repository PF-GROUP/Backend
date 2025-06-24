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
import { Query } from 'typeorm/driver/Query';
import { Customization } from 'src/Customization/customization.entity';

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

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]+/g, '')
      .replace(/_+/g, '_')
      .replace(/^_+/, '')
      .replace(/_+$/, '');
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

      const customizationRepo = queryRunner.manager.getRepository(Customization);
      const customizationes = [
        await customizationRepo.save(
          queryRunner.manager.create(Customization, {
            logoImage: 'https://picsum.photos/200/300',
            mainColors: '#000',
            backgroundColor: '#fff',
            font: 'Open Sans',
            isDefault: true,
          }),
        ),
        await customizationRepo.save(
          queryRunner.manager.create(Customization, {
            theme: 'dark',
            logoImage: 'https://picsum.photos/200/300?grayscale',
            mainColors: '#fff',
            backgroundColor: '#000',
            font: 'Montserrat',
            isDefault: false,
          }),
        ),
        await customizationRepo.save(
          queryRunner.manager.create(Customization, {
            name: 'Minimalist',
            theme: 'minimalist',
            logoImage: 'https://picsum.photos/200/300?blur',
            mainColors: '#333',
            backgroundColor: '#fff',
            font: 'Lato',
            isDefault: false,
          }),
        ),

      ]
      console.log(`Seeded ${customizationes.length} Customization records.`);

      const agencyRepo = queryRunner.manager.getRepository(Agency);
      const agenciesToCreate = [
        {
          name: 'Luxury Estates',
          description: 'Premier properties y servicios real estate.',
          document: '1234567890',
          slug: this.generateSlug('Luxury Estates'),
          customization: customizationes[0],
        },
        {
          name: 'Dream Homes',
          description: 'La casa de tus sueños.',
          document: '0987654321',
          slug: this.generateSlug('Dream Homes'),
          customization: customizationes[1],
        },
        {
          name: 'Prime Properties',
          description: 'Exelencia en real estate.',
          document: '1122334455',
          slug: this.generateSlug('Prime Properties'),
          customization: customizationes[2],
        },
      ];
      const createdAgencies = agenciesToCreate.map((data) =>
        agencyRepo.create(data),
      );
      const agencies = await agencyRepo.save(createdAgencies);
      console.log(`Seeded ${agencies.length} Agency records.`);

      // Seeder de usuarios con contrasenas hasheadas
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

      // Get property types for seeding properties
      const propertyType1 = await this.getPropertyType(
        queryRunner,
        PropertyTypeName.CASA,
      );
      const propertyType2 = await this.getPropertyType(
        queryRunner,
        PropertyTypeName.DEPARTAMENTO,
      );
      const propertyType3 = await this.getPropertyType(
        queryRunner,
        PropertyTypeName.OFICINA,
      );

      // Seeder de propiedades
      const propertyRepo = queryRunner.manager.getRepository(Property);
      const propertiesToCreate = [
        {
          name: 'Modern Apartment in City Center',
          description: 'Beautiful modern apartment with great views.',
          price: 250000,
          address: '123 Main St, New York, NY',
          city: 'New York',
          rooms: 2,
          bathrooms: 2,
          m2: 120,
          status: Status.Disponible,
          type: Type.Alquiler,
          agency: agencies[0],
          typeOfProperty: propertyType2,
        },
        {
          name: 'Luxury Villa with Pool',
          description: 'Amazing villa with private pool and garden.',
          price: 850000,
          address: '456 Ocean Dr, Miami, FL',
          city: 'Miami',
          rooms: 4,
          bathrooms: 3,
          m2: 320,
          status: Status.Disponible,
          type: Type.Venta,
          agency: agencies[1],
          typeOfProperty: propertyType1,
        },
        {
          name: 'Downtown Office Space',
          description: 'Prime office space in the heart of the city.',
          price: 500000,
          address: '789 Business Ave, Chicago, IL',
          city: 'Chicago',
          rooms: 3,
          bathrooms: 2,
          m2: 500,
          status: Status.Disponible,
          type: Type.Alquiler,
          agency: agencies[2],
          typeOfProperty: propertyType3,
        },
      ];
      const createdProperties = propertiesToCreate.map((data) =>
        propertyRepo.create(data),
      );
      const properties = await propertyRepo.save(createdProperties);
      console.log(`Seeded ${properties.length} Property records.`);

      // Seeder de imagenes
      const imageRepo = queryRunner.manager.getRepository(Images);
      const imagesToCreate = [
        {
          file: 'https://example.com/image1.jpg',
          property: properties[0],
        },
        {
          file: 'https://example.com/image2.jpg',
          property: properties[1],
        },
        {
          file: 'https://example.com/image3.jpg',
          property: properties[2],
        },
      ];
      const createdImages = imagesToCreate.map((data) =>
        imageRepo.create(data),
      );
      await imageRepo.save(createdImages);
      console.log(`Seeded ${createdImages.length} Image records.`);

      await queryRunner.commitTransaction();
      console.log('✅ Database seeded successfully!');
    } catch (error) {
      console.error('Error seeding database:', error);
      await queryRunner.rollbackTransaction();
      console.error('❌ Error al seedear la base de datos:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
