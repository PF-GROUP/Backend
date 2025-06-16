
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/Interface/jwtpayload';
import { Role } from 'src/Enum/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const secret = process.env.JWT_SECRET;
      const user = this.jwtService.verify<JwtPayload>(token, { secret });

      
      user['roles'] = user.isAdmin ? [Role.Admin] : [Role.User];

      
      user.exp = new Date(user.exp! * 1000) as unknown as number; 
      user.iat = new Date(user.iat! * 1000) as unknown as number;

      request.user = user; // 
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
 