import {  Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Logger, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLoginDto, GoogleLoginDto } from './create-login.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import {config as dotenvconfig} from "dotenv"
import { createUserAndAgencyDto, createUserAndAgencyWithGoogleDto } from './create-register.dto';
import { User } from '../user/user.entity';
dotenvconfig({path: ".env.development"});

@Controller('auth')
export class AuthController {
    private readonly logger : Logger
    constructor(private readonly authService: AuthService) {
        this.logger = new Logger(AuthController.name); // Initialize Logger
    }

  @Post("createBoth")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: createUserAndAgencyDto, @Res({passthrough: true}) res: Response) {
    const {token, user} = await this.authService.registerUserAndAgency(registerDto);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    })
    return {content:user, message: "Se ha registrado exitosamente"}


  }

@Post("createBothWithGoogle")
  @HttpCode(HttpStatus.CREATED)
  async registerGoogle(@Body() registerDto: createUserAndAgencyWithGoogleDto, @Res({passthrough: true}) res: Response) {
      const {token, user} = await this.authService.registerUserAndAgencyWithGoogle(registerDto);
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        expires: new Date(Date.now() + 60 * 60 * 1000),
        secure: process.env.NODE_ENV === 'production',
      })
      return {content:user, message: "Se ha registrado exitosamente con google"}
  }

  @Post('logout')
  logout(@Req() req, @Res({passthrough: true}) res: Response) {
    res.clearCookie('token');
    return { message: 'Logout successful' };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK) // Login devolvera 200 OK
  async login(@Body() createLoginDto: CreateLoginDto, @Res({passthrough: true}) res: Response) {
    this.logger.log(`Verificando login para email: ${createLoginDto.email}`); // log de intento
    try {
      const {token, user}= await this.authService.login(createLoginDto); //
      this.logger.log(`Login exitoso para email: ${createLoginDto.email}`); // log con exito
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
      return {content:user, message: "Se ha logeado exitosamente"}
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Login fallo para email: ${createLoginDto.email}. Error: ${error.message}`, // Error de log
      )
      throw new InternalServerErrorException('Error al iniciar sesión');
    } 
  }


  @Post('login/tokenSignin')
  async tokenSignin(@Body() tokenOfGoogle: GoogleLoginDto, @Res({passthrough: true}) res: Response) {
    const {token, user} = await this.authService.tokenSignin(tokenOfGoogle);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
    return {content:user, message: "Se ha logeado exitosamente con google"} 
  }

  @Get('login/tokenSignin/:tokenId')
  async verify(@Param('tokenId') tokenId: string) {
    const data = await this.authService.getDataFromToken(tokenId) 
    return {content:data, message: "Token verificado exitosamente"}
    
  }

  @Get('session_refresh')
  @UseGuards(AuthGuard)
  async sessionRefresh(@Res({passthrough: true}) res: Response, @Req() req: Request & {user: User}) {
    const {token, user} = await this.authService.refreshSession(req.user.id);
        res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
    return {content:user, message: "Se ha refrescado la sesion exitosamente"} 
  }
  @Get('me')
  @UseGuards(AuthGuard)
   me(@Req() req: Request & {user: User}) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {content: req.user, message: 'Fue logeado existosamente'}
  }

  @Get('ValidToken')
  @UseGuards(AuthGuard) 
   ValidToken() {
    return {content: true, message: 'Fue logeado existosamente'}
  }


}
