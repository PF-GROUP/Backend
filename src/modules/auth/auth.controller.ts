import { BadRequestException, Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Logger, Post, Res } from '@nestjs/common';
import { CreateRegisterDto } from './create-register.dto';
import { AuthService } from './auth.service';
import { CreateLoginDto, GoogleLoginDto } from './create-login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    private readonly logger : Logger
    constructor(private readonly authService: AuthService) {
        this.logger = new Logger(AuthController.name); // Initialize Logger
    }

  @Post("/register")
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



  @Post("/login")
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


  @Post('/login/tokenSignin')
  async tokenSignin(@Body() tokenOfGoogle: GoogleLoginDto, @Res({passthrough: true}) res: Response) {
    const {token} = await this.authService.tokenSignin(tokenOfGoogle);
    res.cookie('token', token, {
      httpOnly: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
    
  }
}
