import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger, // Import Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/User/user.entity';
import { Agency } from 'src/Agency/agency.entity';
import { CreateRegisterDto } from './dto/create-register.dto';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name); // Inicializar Logger

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    private readonly dataSource: DataSource,
  ) {}

  async register(
    registerDto: CreateRegisterDto,
  ): Promise<{ user: User; agency: Agency }> {
    this.logger.log(`Comenzando registro para email: ${registerDto.email}`);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.log('Transaccion de base de datos iniciada.');

    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        this.logger.warn(
          `Registro fallo: User con email ${registerDto.email} ya existe.`,
        );
        throw new ConflictException('Usuario con este email ya existe');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        saltRounds,
      );
      this.logger.debug('Contrasena hasheada exitosamente.');

      const user = this.userRepository.create({
        name: registerDto.name,
        surname: registerDto.surname,
        phone: registerDto.phone,
        email: registerDto.email,
        password: hashedPassword,
        isAdmin: false,
      });

      const savedUser = await queryRunner.manager.save(User, user);
      this.logger.log(
        `User creado con ID: ${savedUser.id} y email: ${savedUser.email}`,
      );

      const agency = this.agencyRepository.create({
        name: registerDto.agencyName,
        description: registerDto.agencyDescription,
        document: registerDto.document,
        user: savedUser,
      });

      const savedAgency = await queryRunner.manager.save(Agency, agency);
      this.logger.log(
        `Agency creada con ID: ${savedAgency.id} y nombre: ${savedAgency.name}`,
      );

      savedUser.agency = savedAgency;
      await queryRunner.manager.save(User, savedUser);
      this.logger.debug(`Agency asociada con user ${savedUser.id}.`);

      await queryRunner.commitTransaction();
      this.logger.log(
        `Registro exitoso para email: ${savedUser.email}. Transaccion completada.`,
      );

      const { password, ...userWithoutPassword } = savedUser;

      return {
        user: userWithoutPassword as User,
        agency: savedAgency,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Registro fallido para email: ${registerDto.email}. Transaccion revertida. Error: ${error.message}`,
        error.stack,
      );

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Registro fallido');
    } finally {
      await queryRunner.release();
      this.logger.log('QueryRunner released.');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    this.logger.log(`Buscando user con email: ${email}`);
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['agency'],
    });
    if (user) {
      this.logger.debug(`User encontrado con email: ${email}`);
    } else {
      this.logger.debug(`No se encontro user con email: ${email}`);
    }
    return user;
  }
}
