import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { User } from '../user/user.entity';
import { CreateRegisterDto, createUserAndAgencyDto, createUserAndAgencyWithGoogleDto } from './create-register.dto';
import * as bcrypt from 'bcrypt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { CreateLoginDto, GoogleLoginDto } from './create-login.dto';
import { UserService } from '../user/user.service';
import { AgencyService } from '../agency/agency.service';
import { Role } from 'src/Enum/roles.enum';
@Injectable()
export class AuthService {
  
  
    private readonly logger: Logger
    private readonly client : OAuth2Client
    
  


  constructor(
    private readonly userService: UserService,
    private readonly agencyService: AgencyService,
    private jwtService: JwtService
  ) {
   this.logger = new Logger(AuthService.name)
   this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  }

async registerUserAndAgency(data: createUserAndAgencyDto) {
    const {agencyName, agencyDescription, document, email, name, surname, password, phone, slug} = data

    const user = await this.register({name, surname, phone, email, password})
    const agency = await this.agencyService.create({name: agencyName, description: agencyDescription, document, agentUser:  user.user.id,slug})

    return {success: true, agencyId: agency.id, userId: user.user.id}

}
async registerUserAndAgencyWithGoogle(registerDto: createUserAndAgencyWithGoogleDto) {
    const {agencyName, agencyDescription, document, email, name, surname, password, phone, slug, token} = registerDto
    const existsUser = await this.userService.findOneByEmail(email)
    if (existsUser) {
      throw new ConflictException('User already exists')
    }
    const user = await this.registerGoogle({name, surname, phone, email, password, token})
    await this.agencyService.create({name: agencyName, description: agencyDescription, document, agentUser:  user.user.id,slug})
    const reNewUser = await this.userService.findOneByEmail(email)
    const {token: payloadToSend, user:userToSend} = this.signJWT(reNewUser!)

    return {token: payloadToSend, user: userToSend} 
}

async registerGoogle(registerGoogleDto: {name: string, surname: string, phone: string, email: string, password: string, token: string}) {
    const {token} = registerGoogleDto

    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      throw new UnauthorizedException('Invalid token')
    }
    const user = await this.userService.createFromGoogle({...registerGoogleDto, googleId: payload.sub, rol: Role.User })
    return {user}
  
}
  async register(
    registerDto: CreateRegisterDto,
  ): Promise<{ user: User /*; agency: Agency */ }> {
    console.log(registerDto)
    this.logger.log(`Comenzando registro para email: ${registerDto.email}`);
    this.logger.log('Transaccion de base de datos iniciada.');

    try {
      const existingUser = await this.userService.findOneByEmail(
        registerDto.email,
      )

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
      const user = await this.userService.create({...registerDto,password: hashedPassword, rol: Role.User });

      this.logger.log(
        `User creado con ID: ${user.id} y email: ${user.email}`,
      );
      this.logger.log(
        `Registro exitoso para email: ${user.email}. Transaccion completada.`,
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword as User,
      };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Registro fallido para email: ${registerDto.email}. Transaccion revertida. Error: ${error.message}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );


      throw new InternalServerErrorException('Registro fallido');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    this.logger.log(`Buscando user con email: ${email}`);
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      this.logger.debug(`User encontrado con email: ${email}`);
    } else {
      this.logger.debug(`No se encontro user con email: ${email}`);
    }
    return user;
  }
  async findOrCreateByGoogleId(payload:TokenPayload): Promise<User> {
    const googleId = payload.sub
    try {
      const existingUser = await this.userService.findOneByGoogleId(googleId)
      if (existingUser) {
        existingUser.email = payload.email!
        existingUser.name = payload.name!
        existingUser.surname = payload.family_name!

        await this.userService.update(existingUser.id, existingUser)
        return existingUser
      }else {
        //debe registrarse con google
        throw new NotFoundException('User not found')
      }
    }catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Registro fallido para email: ${payload.email}. Transaccion revertida. Error: ${error.message}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      throw new InternalServerErrorException('Registro fallido');
    } 
    
  }


  
  async login(createLoginDto: CreateLoginDto): Promise<{token: string, user: { id: string; name: string; surname: string; email: string; isAdmin: boolean}}> {
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
    const {token, user:userToSend} = this.signJWT(user);
    return {token,user:userToSend};
  }
  async tokenSignin(token: GoogleLoginDto) {
   const res = await this.verify(token.token)
   console.log(res)
   return res
  }

  async getDataFromToken(token: string) {
    const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  
    });
    const payload = ticket.getPayload();
    if (!payload) {
        throw new UnauthorizedException('Invalid token');
    }
    return payload
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
  const  {token: payloadToSend, user:userToSend} = this.signJWT(user)

  return {token: payloadToSend , user: userToSend}
  
}

 private signJWT(user: User) {
  console.log(user)
  const payload = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    isAdmin: user.isAdmin,
    agencyId: user.agency?.id
  };
  const token = this.jwtService.sign(payload);
  return { token , user: payload };
}






















}
