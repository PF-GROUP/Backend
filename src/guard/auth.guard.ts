
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/Interface/jwtpayload';
import { Role } from 'src/Enum/roles.enum';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/user.entity';
import { AgencyService } from 'src/modules/agency/agency.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, private readonly userService:UserService, private readonly agencyService:AgencyService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.cookies || !request.cookies.token || !request)  {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = request.cookies?.token as string
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }


    try {

      const userInPayload = this.jwtService.verify<JwtPayload>(token)
      const user:User = await this.userService.findOne(userInPayload.id)
      const updatedPayload: JwtPayload = {
        ...userInPayload,
        roles: user.isAdmin ? [Role.Admin] : [Role.User],
      };

      request.user = updatedPayload;

    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
 