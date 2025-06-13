import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/create-register.dto';

@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.registerService.register(registerDto);
      return {
        success: true,
        message: 'Usuario y Agencia registrados exitosamente',
        data: {
          userId: result.user.id,
          agencyId: result.agency.id,
          userEmail: result.user.email,
          agencyName: result.agency.name,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registro fallido',
        data: null,
      };
    }
  }
}
