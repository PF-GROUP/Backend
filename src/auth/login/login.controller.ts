import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger, // Import Logger
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';

@Controller('login')
export class LoginController {
  private readonly logger = new Logger(LoginController.name); // Initialize Logger

  constructor(private readonly loginService: LoginService) {}

  @Post()
  @HttpCode(HttpStatus.OK) // Login devolvera 200 OK
  async login(@Body() createLoginDto: CreateLoginDto) {
    this.logger.log(`Verificando login para email: ${createLoginDto.email}`); // log de intento
    try {
      const result = await this.loginService.login(createLoginDto); //
      this.logger.log(`Login exitoso para email: ${createLoginDto.email}`); // log con exito
      return {
        success: true,
        message: 'Login exitoso',
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Login fallo para email: ${createLoginDto.email}. Error: ${error.message}`, // Error de log
        error.stack, // error de stack
      );
      return {
        success: false,
        message: error.message || 'Login fallo',
        data: null,
      };
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
