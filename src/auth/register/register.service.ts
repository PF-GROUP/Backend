import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/User/user.entity';
import { Agency } from 'src/Agency/agency.entity';
import { RegisterDto } from './dto/create-register.dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    private readonly dataSource: DataSource,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; agency: Agency }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Usuario con este email ya existe');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        saltRounds,
      );

      const user = this.userRepository.create({
        name: registerDto.name,
        surname: registerDto.surname,
        phone: registerDto.phone,
        email: registerDto.email,
        password: hashedPassword,
        isAdmin: false,
      });

      // Guardar usuario usando queryRunner
      const savedUser = await queryRunner.manager.save(User, user);

      const agency = this.agencyRepository.create({
        name: registerDto.agencyName,
        description: registerDto.agencyDescription,
        document: registerDto.document,
        user: savedUser,
      });

      // Guardar agencia usando queryRunner
      const savedAgency = await queryRunner.manager.save(Agency, agency);

      // Asociar agencia al usuario
      savedUser.agency = savedAgency;
      await queryRunner.manager.save(User, savedUser);

      await queryRunner.commitTransaction();

      const { password, ...userWithoutPassword } = savedUser;

      return {
        user: userWithoutPassword as User,
        agency: savedAgency,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Registro fallido');
    } finally {
      await queryRunner.release();
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['agency'],
    });
  }
}
