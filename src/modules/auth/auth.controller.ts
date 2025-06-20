import { Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Logger, Post, Res, UseGuards } from '@nestjs/common';
import {  createUserAndAgencyDto } from './create-register.dto';
import { AuthService } from './auth.service';
import { CreateLoginDto, GoogleLoginDto } from './create-login.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import {config as dotenvconfig} from "dotenv"
dotenvconfig({path: ".env.development"});

@Controller('auth')
export class AuthController {
    private readonly logger : Logger
    constructor(private readonly authService: AuthService) {
        this.logger = new Logger(AuthController.name); // Initialize Logger
    }

  @Post("createBoth")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: createUserAndAgencyDto) {
      return await this.authService.registerUserAndAgency(registerDto);

  }



  @Post("login")
  @HttpCode(HttpStatus.OK) // Login devolvera 200 OK
  async login(@Body() createLoginDto: CreateLoginDto, @Res({passthrough: true}) res: Response) {
    this.logger.log(`Verificando login para email: ${createLoginDto.email}`); // log de intento
    try {
      const {token}= await this.authService.login(createLoginDto); //
      this.logger.log(`Login exitoso para email: ${createLoginDto.email}`); // log con exito
      res.cookie('token', token, {
        httpOnly: false,
        sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
      
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Login fallo para email: ${createLoginDto.email}. Error: ${error.message}`, // Error de log
      )
      return new InternalServerErrorException('Error al iniciar sesión');
    }
  }


  @Post('login/tokenSignin')
  async tokenSignin(@Body() tokenOfGoogle: GoogleLoginDto, @Res({passthrough: true}) res: Response) {
    const {token} = await this.authService.tokenSignin(tokenOfGoogle);
    res.cookie('token', token, {
      httpOnly: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
    
  }

  @Get('me')
  @UseGuards(AuthGuard)
   me(@Res({passthrough: true}) res: Response & {user: any}) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.user
  }
}
