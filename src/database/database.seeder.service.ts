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
    const propertyType = await typeRepo.findOne({ where: { type } });

    if (!propertyType) {
      console.error(`Tipo de propiedad no encontrado: ${type}`);
      throw new Error(
        `Tipo de propiedad '${type}' no encontrado en la base de datos`,
      );
    }

    console.log(
      `Tipo de propiedad encontrado: ${type} con ID: ${propertyType.id}`,
    );
    return propertyType;
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

    // Obtener todo los valores de enum
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

      const customizationRepo =
        queryRunner.manager.getRepository(Customization);
      const customizationes = [
        // Personalizacion para Luxury Estates
        await customizationRepo.save(
          queryRunner.manager.create(Customization, {
            logoImage:
              'https://static.vecteezy.com/resources/thumbnails/small/real-estate-logo-design-png.png',
            information:
              'Especialistas en propiedades premium con atención personalizada.',
            mainColors: '#1E3A8A',
            banner: 'https://i.imgur.com/def456.jpg',
            navbarColor: '#1D4ED8',
            buttonColor: '#2563EB',
            backgroundColor: '#EFF6FF',
            secondaryColor: '#64748B',
            isDefault: false,
          }),
        ),
        // Personalizacion para Dream Homes
        await customizationRepo.save(
          queryRunner.manager.create(Customization, {
            logoImage:
              'https://static.vecteezy.com/resources/thumbnails/small/real-estate-logo-design-png.png',
            information:
              'Encontrá la casa de tus sueños con nuestro asesoramiento experto.',
            mainColors: '#0F4C81',
            banner: 'https://i.imgur.com/ghi789.jpg',
            navbarColor: '#0F4C81',
            buttonColor: '#3A7CA5',
            backgroundColor: '#F8F9FA',
            secondaryColor: '#5B8EAD',
            isDefault: false,
          }),
        ),
        // Personalizacion para Prime Properties
        await customizationRepo.save(
          queryRunner.manager.create(Customization, {
            logoImage:
              'https://static.vecteezy.com/resources/thumbnails/small/real-estate-logo-design-png.png',
            information: 'Excelencia en asesoramiento inmobiliario desde 1995.',
            mainColors: '#2A5C45',
            banner: 'https://i.imgur.com/jkl012.jpg',
            navbarColor: '#2A5C45',
            buttonColor: '#3A7D44',
            backgroundColor: '#F5F5F5',
            secondaryColor: '#6B8F71',
            isDefault: false,
          }),
        ),
        // Personalizacion para Admin Properties
        await customizationRepo.save(
          queryRunner.manager.create(Customization, {
            logoImage:
              'https://static.vecteezy.com/resources/thumbnails/small/real-estate-logo-design-png.png',
            information: 'Panel de administración del sistema inmobiliario.',
            mainColors: '#1E3A8A',
            banner: 'https://i.imgur.com/mno345.jpg',
            navbarColor: '#1D4ED8',
            buttonColor: '#2563EB',
            backgroundColor: '#FFFFFF',
            secondaryColor: '#64748B',
            isDefault: true,
          }),
        ),
      ];
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
          description: 'La casa de tus suenos.',
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
        {
          name: 'Admin Properties',
          description: 'Agencia administrativa del sistema.',
          document: '9999999999',
          slug: this.generateSlug('Admin Properties'),
          customization: customizationes[0],
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
        // Usuario administrador - Credenciales para Swagger
        {
          name: 'Admin',
          surname: 'User',
          phone: '+1234567890',
          email: 'admin@example.com',
          password: await this.hashPassword('admin123'),
          isAdmin: true,
          agency: agencies[3], // Usa la cuarta agencia (Admin Properties)
        },
        {
          name: 'Mark',
          surname: 'Julien',
          phone: '+1234567891',
          email: 'mark.julien@example.com',
          password: await this.hashPassword('password123'),
          isAdmin: false,
          agency: agencies[0],
        },
        {
          name: 'Jane',
          surname: 'Smith',
          phone: '+1987654321',
          email: 'jane.smith@example.com',
          password: await this.hashPassword('password123'),
          isAdmin: false,
          agency: agencies[1],
        },
        {
          name: 'Tom',
          surname: 'Clancy',
          phone: '+1122334455',
          email: 'tom.clancy@example.com',
          password: await this.hashPassword('agent123'),
          isAdmin: false,
          agency: agencies[2],
        },
      ];
      const createdUsers = usersToCreate.map((data) => userRepo.create(data));
      const users = await userRepo.save(createdUsers);
      console.log(`Seeded ${users.length} User records.`);

      // Asignar los usuarios a las agencias
      agencies[0].user = users[1];
      agencies[1].user = users[2];
      agencies[2].user = users[3];
      agencies[3].user = users[0]; // Admin Properties -> Admin
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
          name: 'Moderno Departamento en Palermo',
          description:
            'Amplio departamento con excelentes terminaciones y vista panoramica a la ciudad.',
          price: 250000,
          address: 'Av. Santa Fe 4500, C1425 CABA',
          city: 'Buenos Aires',
          rooms: 2,
          bathrooms: 1,
          m2: 65,
          status: Status.Disponible,
          type: Type.Alquiler,
          agency: agencies[0],
          type_of_property_id: propertyType2,
        },
        {
          name: 'Casa de Lujo en Barrio Cerrado',
          description:
            'Espectacular casa con piscina, parque y quincho en exclusivo barrio cerrado.',
          price: 450000,
          address: 'Las Lomas del Golf, Pilar',
          city: 'Pilar',
          rooms: 4,
          bathrooms: 3,
          m2: 280,
          status: Status.Disponible,
          type: Type.Venta,
          agency: agencies[1],
          type_of_property_id: propertyType1,
        },
        {
          name: 'Oficina en Microcentro',
          description:
            'Excelente oficina en pleno centro financiero, lista para usar con excelentes vistas.',
          price: 3500,
          address: 'Av. Corrientes 1234, C1043 CABA',
          city: 'Buenos Aires',
          rooms: 3,
          bathrooms: 2,
          m2: 90,
          status: Status.Disponible,
          type: Type.Alquiler,
          agency: agencies[2],
          type_of_property_id: propertyType3,
        },
        {
          name: 'Casa Familiar en Barrio Cerrado',
          description:
            'Hermosa casa familiar con parque, piscina y parrilla en Nordelta.',
          price: 3800,
          address: 'Los Alerces 123, Nordelta',
          city: 'Tigre',
          rooms: 3,
          bathrooms: 2,
          m2: 180,
          status: Status.Disponible,
          type: Type.Alquiler,
          agency: agencies[3],
          type_of_property_id: propertyType1,
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
