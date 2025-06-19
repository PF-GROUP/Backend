
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

    if (!request.cookies || !request.cookies.token || !request)  {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = request.cookies?.token as string
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }


    try {

      const user = this.jwtService.verify<JwtPayload>(token)

      
      user['roles'] = user.isAdmin ? [Role.Admin] : [Role.User];

      
      user.exp = new Date(user.exp! * 1000) as unknown as number; 
      user.iat = new Date(user.iat! * 1000) as unknown as number;

      request.user = user; // 
    } catch  {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
 