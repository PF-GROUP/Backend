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
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
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
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1750970243/logo1_n2evmh.png',
            information:
              'Especialistas en propiedades premium con atención personalizada.',
            mainColors: '#1E3A8A',
            banner:
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1750970242/banner1_amu36t.png',
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
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1750970243/logo1_n2evmh.png',
            information:
              'Encontra la casa de tus sueños con nuestro asesoramiento experto.',
            mainColors: '#0F4C81',
            banner:
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751050693/banner1_rsgd3b.png',
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
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060388/logo2_hlgcr2.png',
            information: 'Excelencia en asesoramiento inmobiliario desde 1995.',
            mainColors: '#2A5C45',
            banner:
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060384/banner2_pie8m5.png',
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
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060390/logo3_wxaa7c.png',
            information: 'Panel de administración del sistema inmobiliario.',
            mainColors: '#1E3A8A',
            banner:
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060385/banner3_gffvud.png',
            navbarColor: '#1D4ED8',
            buttonColor: '#2563EB',
            backgroundColor: '#FFFFFF',
            secondaryColor: '#64748B',
            isDefault: true,
          }),
        ),
        // Personalizacion para Urban Living
        await customizationRepo.save(
          queryRunner.manager.create(Customization, {
            logoImage:
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060391/logo4_pdtqfp.png',
            information: 'Viviendas modernas en las mejores zonas urbanas.',
            mainColors: '#6B46C1',
            banner:
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060386/banner4_nex3vq.png',
            navbarColor: '#6B46C1',
            buttonColor: '#805AD5',
            backgroundColor: '#FAF5FF',
            secondaryColor: '#9F7AEA',
            isDefault: false,
          }),
        ),
        // Personalizacion para Admin Properties
        await customizationRepo.save(
          queryRunner.manager.create(Customization, {
            logoImage:
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060393/logo5_ivgofk.png',
            information: 'Panel de administración del sistema inmobiliario.',
            mainColors: '#1E3A8A',
            banner:
              'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060387/banner5_nbbiyy.png',
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
          name: 'Urban Living',
          description: 'Viviendas modernas en las mejores zonas urbanas.',
          document: '11893344523',
          slug: this.generateSlug('Urban Living'),
          customization: customizationes[3],
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
          profilePictureUrl:
            'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751063921/profile1_ya9vvf.jpg',
        },
        {
          name: 'Kayla',
          surname: 'Sullivan',
          phone: '+1234567890',
          email: 'kayla.sullivan@example.com',
          password: await this.hashPassword('password123'),
          isAdmin: false,
          agency: agencies[4],
          profilePictureUrl:
            'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751063922/profile2_aunsls.jpg',
        },
        {
          name: 'Mark',
          surname: 'Julien',
          phone: '+1234567891',
          email: 'mark.julien@example.com',
          password: await this.hashPassword('password123'),
          isAdmin: false,
          agency: agencies[0],
          profilePictureUrl:
            'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751063925/profile3_nlqfkj.jpg',
        },
        {
          name: 'Jane',
          surname: 'Smith',
          phone: '+1987654321',
          email: 'jane.smith@example.com',
          password: await this.hashPassword('password123'),
          isAdmin: false,
          agency: agencies[1],
          profilePictureUrl:
            'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751063926/profile4_hpzwyp.jpg',
        },
        {
          name: 'Tom',
          surname: 'Clancy',
          phone: '+1122334455',
          email: 'tom.clancy@example.com',
          password: await this.hashPassword('password123'),
          isAdmin: false,
          agency: agencies[2],
          profilePictureUrl:
            'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751063928/profile5_tuk37v.jpg',
        },
      ];
      const createdUsers = usersToCreate.map((data) => userRepo.create(data));
      const users = await userRepo.save(createdUsers);
      console.log(`Seeded ${users.length} User records.`);

      // Asignar los usuarios a las agencias
      agencies[0].user = users[2];
      agencies[1].user = users[3];
      agencies[2].user = users[4];
      agencies[3].user = users[0]; // Admin Properties -> Admin
      agencies[4].user = users[1];
      await agencyRepo.save(agencies);

      // Obtener los tipos de propiedad
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
      const propertyType4 = await this.getPropertyType(
        queryRunner,
        PropertyTypeName.CHALET,
      );
      const propertyType5 = await this.getPropertyType(
        queryRunner,
        PropertyTypeName.GALPON,
      );

      // Seeder de propiedades
      const propertyRepo = queryRunner.manager.getRepository(Property);
      const propertiesToCreate = [
        {
          name: 'Loft Industrial con Estilo Unico',
          description:
            'Exclusivo loft en edificio reciclado con estilo industrial, techos altos, columnas a la vista y grandes ventanales. Espacio diafano de 120m2 con cocina integrada de alta gama, baño completo con ducha a la vista y vestidor. Ubicado en el corazón de San Telmo, a metros de parques, galerías de arte y los mejores restaurantes. Incluye cochera cubierta y acceso a terraza con parrilla y jacuzzi.',
          price: 250000,
          address: 'Av. Santa Fe 4500, C1425 CABA',
          city: 'Buenos Aires',
          rooms: 2,
          bathrooms: 1,
          m2: 3500,
          status: Status.Disponible,
          type: Type.Alquiler,
          agency: agencies[0],
          type_of_property_id: propertyType2,
        },
        {
          name: 'Quinta con Piscina y Cancha de Paddle',
          description:
            'Hermosa quinta de fin de semana en lote de 2500m2. Casa principal con 3 dormitorios (principal en suite), living comedor con hogar a lena, cocina comedor diario con horno de barro y amplia galeria cubierta. Piscina de 12x5 con solarium, cancha de paddle iluminada, quincho con parrilla y horno de barro. Frondosa arboleda con especies autóctonas, pozo de agua y sistema de riego automatico. Excelente ubicacion a solo 5 minutos del centro de Escobar y acceso directo a la ruta Panamericana.',
          price: 450000,
          address: 'Las Lomas del Golf, Pilar',
          city: 'Escobar',
          rooms: 4,
          bathrooms: 3,
          m2: 2500,
          status: Status.Disponible,
          type: Type.Venta,
          agency: agencies[1],
          type_of_property_id: propertyType1,
        },
        {
          name: 'Moderno Chalet con Vista al Lago',
          description:
            'Impresionante chalet de diseno con vistas panoramicas al lago. Amplios ventanales, living de doble altura, cocina moderna con isla, 3 suites (principal con vestidor y jacuzzi), parrilla techada, solarium y muelle privado. Incluye domotica, calefaccion por losa radiante y sistema de riego automatico. Excelente ubicacion a 5 minutos del centro comercial y colegios internacionales.',
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
          name: 'Casa Quinta con Pileta en Barrio Cerrado',
          description:
            'Encantadora casa quinta en complejo con seguridad las 24hs. Amplio parque con arboles frutales, piscina climatizada, parrilla cubierta, cochera para 3 autos. Interior con living comedor con hogar a leña, cocina integrada con isla, escritorio, 4 amplios dormitorios (principal en suite con vestidor), quincho con bano y cochera. Excelente ubicacion cerca del club house con canchas de tenis, paddle y gimnasio.',
          price: 3800,
          address: 'Los Alerces 123, Nordelta',
          city: 'Tigre',
          rooms: 3,
          bathrooms: 2,
          m2: 180,
          status: Status.Disponible,
          type: Type.Alquiler,
          agency: agencies[3],
          type_of_property_id: propertyType4,
        },
        {
          name: 'Mansion Moderna en Nordelta',
          description:
            'Exclusiva propiedad de lujo con diseno contemporaneo, piscina infinita, jardin con parque arbolado, quincho techado con parrilla y horno de barro, gimnasio equipado, home theater y seguridad 24/7. Excelente ubicación frente al lago con salida nautica.',
          price: 8500,
          address: 'Paseo del Lago 2450, Nordelta',
          city: 'Tigre',
          rooms: 5,
          bathrooms: 5,
          m2: 420,
          status: Status.Disponible,
          type: Type.Alquiler,
          agency: agencies[4],
          type_of_property_id: propertyType5,
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
          file: 'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060703/property1_cyleiv.jpg',
          property: properties[0],
        },
        {
          file: 'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060706/property2_tfga6d.jpg',
          property: properties[1],
        },
        {
          file: 'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060705/property3_j3yh96.jpg',
          property: properties[2],
        },
        {
          file: 'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060706/property4_mttjor.jpg',
          property: properties[3],
        },
        {
          file: 'https://res.cloudinary.com/dqpy1fd8i/image/upload/v1751060708/property5_tqr54b.jpg',
          property: properties[4],
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
