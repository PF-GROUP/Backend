import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateRegisterDto } from './create-register.dto';
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

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: CreateRegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return {
        success: true,
        message: 'Usuario y Agencia registrados exitosamente',
        data: {
          userId: result.user.id,
          // agencyId: result.agency.id,
          userEmail: result.user.email,
          // agencyName: result.agency.name,
        },
      };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException("Hubo un error al registrarse");
    }
  }



  @Post("login")
  @HttpCode(HttpStatus.OK) // Login devolvera 200 OK
  async login(@Body() createLoginDto: CreateLoginDto, @Res({passthrough: true}) res: Response) {
    this.logger.log(`Verificando login para email: ${createLoginDto.email}`); // log de intento
    try {
      const {token, user}= await this.authService.login(createLoginDto); //
      this.logger.log(`Login exitoso para email: ${createLoginDto.email}`); // log con exito
      res.cookie('token', token, {
        httpOnly: false,
        sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
      return user
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
    const {payloadToSend, user} = await this.authService.tokenSignin(tokenOfGoogle);
    res.cookie('token', payloadToSend, {
      httpOnly: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
    return user 
  }

  @Get('me')
  @UseGuards(AuthGuard)
   me(@Req() req: Request & {user: any}) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return req.user
  }
}
