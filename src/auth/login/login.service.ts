import {
  Injectable,
  UnauthorizedException,
  Logger, // Importar Logger
} from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { RegisterService } from '../register/register.service'; // Importar RegisterService
import * as bcrypt from 'bcrypt';
import { User } from 'src/User/user.entity';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name); // Inicializar Logger

  constructor(private readonly registerService: RegisterService) {} // Inyectar RegisterService

  async login(createLoginDto: CreateLoginDto): Promise<{ user: User }> {
    this.logger.log(`Verificando login para email: ${createLoginDto.email}`);
    const user = await this.registerService.findUserByEmail(
      createLoginDto.email,
    );

    if (!user) {
      this.logger.warn(`Login fallo para email: ${createLoginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(
      `Usuario encontrado para email: ${createLoginDto.email}. Comparando contrasenas.`,
    );
    const isPasswordValid = await bcrypt.compare(
      createLoginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(
        `Login fallo: contrasena invalida de email: ${createLoginDto.email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(
      `Contrasena valida para email: ${user.email}. Login exitoso.`,
    );
    // Omitir contrasena
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User };
  }
}

// import { BadRequestException, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import {  CreateLoginDto } from './dto/create-login.dto';
// import { UpdateLoginDto } from './dto/update-login.dto';
// import { Repository } from 'typeorm';
// import { User } from 'src/User/user.entity';
// import * as bcrypt from 'bcrypt';
// import { InjectRepository } from '@nestjs/typeorm';


// @Injectable()
// export class LoginService {
//    constructor(
//       private jwtService: JwtService,
//       @InjectRepository(User) // o tu entidad correspondiente
//       private usersRepository: Repository<User>,
//    ) {}
//   async signIn(credentials: CreateLoginDto) {
//     const findUser = await this.usersRepository.findOneBy({
//       email: credentials.email,
//     })

//     if (!findUser) throw new BadRequestException ('Bad credentials');

//     const passwordMatch = await bcrypt.compare(
//       credentials.password,
//       findUser.password,
//     );

//     if (!passwordMatch) throw new BadRequestException ('Bad credentials');
//     const payload = {
//       id: findUser.id,
//       email: findUser.email,
//       isAdmin: findUser.isAdmin,
//     };
//     const token = this.jwtService.sign(payload);

//     return { access_token: token };
//   }
// }
