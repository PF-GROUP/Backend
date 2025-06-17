import {
  Injectable,
  UnauthorizedException,
  Logger, // Importar Logger
} from '@nestjs/common';
import { CreateLoginDto, GoogleLoginDto } from './dto/create-login.dto';
import { RegisterService } from '../register/register.service'; // Importar RegisterService
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import {OAuth2Client} from "google-auth-library"
import {config as dotenvconfig} from "dotenv"
dotenvconfig({path: ".env.development"});

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name); // Inicializar Logger
  private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(private readonly registerService: RegisterService, private jwtService: JwtService) {} // Inyectar RegisterService
  
  async login(createLoginDto: CreateLoginDto): Promise<{token: string}> {
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
  const user = await this.registerService.findOrCreateByGoogleId(payload)
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

//     
//   }
// }
