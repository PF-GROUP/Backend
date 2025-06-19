import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Agency } from '../agency/agency.entity';
import { User } from '../user/user.entity';
import { CreateRegisterDto } from './create-register.dto';
import * as bcrypt from 'bcrypt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto, GoogleLoginDto } from './create-login.dto';
@Injectable()
export class AuthService {


    private readonly logger: Logger
    private readonly client : OAuth2Client

  


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    private readonly dataSource: DataSource,
    private jwtService: JwtService
  ) {
   this.logger = new Logger(AuthService.name)
   this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  }

  async register(
    registerDto: CreateRegisterDto,
  ): Promise<{ user: User /*; agency: Agency */ }> {
    console.log(registerDto)
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const hashedPassword: string = await bcrypt.hash(
        registerDto.password,
        saltRounds,
      ) ;
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
      await queryRunner.commitTransaction();
      this.logger.log(
        `Registro exitoso para email: ${savedUser.email}. Transaccion completada.`,
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser;

      return {
        user: userWithoutPassword as User,
        // agency: savedAgency,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException) throw error;
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Registro fallido para email: ${registerDto.email}. Transaccion revertida. Error: ${error.message}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );


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
  async findOrCreateByGoogleId(payload:TokenPayload): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const googleId = payload.sub
    try {
      const existingUser = await this.userRepository.findOne({
        where: { googleId },
      });
      
      if (existingUser) {
        existingUser.email = payload.email!
        existingUser.name = payload.name!
        existingUser.surname = payload.family_name!
        await queryRunner.manager.save(User, existingUser);
        await queryRunner.commitTransaction();
        return existingUser
      }else {
        const user = this.userRepository.create({
          name: payload.name,
          surname: payload.family_name,
          email: payload.email,
          googleId,
          isAdmin: false,
        });
        const savedUser = await queryRunner.manager.save(User, user);
        await queryRunner.commitTransaction();
        return savedUser
      }
    }catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Registro fallido para email: ${payload.email}. Transaccion revertida. Error: ${error.message}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      throw new InternalServerErrorException('Registro fallido');
    } finally {
      await queryRunner.release();
      this.logger.log('QueryRunner released.');
    }
    
  }


  
  async login(createLoginDto: CreateLoginDto): Promise<{token: string}> {
    this.logger.log(`Verificando login para email: ${createLoginDto.email}`);
    const user = await this.findUserByEmail(
      createLoginDto.email,
    );
    
    if (!user) {
      this.logger.warn(`Login fallo para email: ${createLoginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(
      `Usuario encontrado para email: ${createLoginDto.email}. Comparando contrasenas.`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid:boolean = await bcrypt.compare(
      createLoginDto.password,
      user.password as unknown as string,
    );

    if (!isPasswordValid) {
      this.logger.warn(
        `Login fallo: contrasena invalida de email: ${createLoginDto.email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.signJWT(user);
    return token;
  }
  async tokenSignin(token: GoogleLoginDto) {
   const res = await this.verify(token.token)
   console.log(res)
   return res
  }

  private async  verify(token: string) {
  const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  if (!payload) {
      throw new UnauthorizedException('Invalid token');
  }
  const user = await this.findOrCreateByGoogleId(payload)
  const  payloadToSend = this.signJWT(user)

  return payloadToSend
  
}

 private signJWT(user: User) {
  const payload = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  const token = this.jwtService.sign(payload);
  return { token };
}






















}
