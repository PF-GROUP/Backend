import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Res,
  InternalServerErrorException, // Import Logger
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { Response } from 'express';

@Controller('auth/login')
export class LoginController {
  private readonly logger = new Logger(LoginController.name); // Initialize Logger

  constructor(private readonly loginService: LoginService) {}

  @Post()
  @HttpCode(HttpStatus.OK) // Login devolvera 200 OK
  async login(@Body() createLoginDto: CreateLoginDto, @Res({passthrough: true}) res: Response) {
    this.logger.log(`Verificando login para email: ${createLoginDto.email}`); // log de intento
    try {
      const {token, user}= await this.loginService.login(createLoginDto); //
      console.log(token, user)
      this.logger.log(`Login exitoso para email: ${createLoginDto.email}`); // log con exito
      res.cookie('token', token, {
        httpOnly: false,
        sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
      
    });
    } catch (error) {
      this.logger.error(
        `Login fallo para email: ${createLoginDto.email}. Error: ${error.message}`, // Error de log
      )
      return new InternalServerErrorException('Error al iniciar sesión');
    }
  }
}

// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { LoginService } from './login.service';
// import { CreateLoginDto } from './dto/create-login.dto';
// import { UpdateLoginDto } from './dto/update-login.dto';

// @Controller('login')
// export class LoginController {
//   constructor(private readonly loginService: LoginService) {}

//   @Post('/signin')
//   signIn(@Body() credentials: CreateLoginDto) {
//     const { email, password } = credentials;
//     return this.loginService.signIn(credentials);
//   }
// }
