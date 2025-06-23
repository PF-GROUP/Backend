import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/Interface/jwtpayload';
import { Role } from 'src/Enum/roles.enum';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.cookies || !request.cookies.token || !request)  {
      throw new UnauthorizedException('Invalid token format');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = request.cookies?.token
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }
    try {
      console.log(token)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const userInPayload = this.jwtService.verify<JwtPayload>(token as string)
      console.log(userInPayload)
      const user:User = await this.userService.findOne(userInPayload.id)
      const updatedPayload: JwtPayload = {
        ...userInPayload,
        roles: user.isAdmin ? [Role.Admin] : [Role.User],
      };
      console.log(updatedPayload)
      request.user = updatedPayload;

    } catch(error) {
      console.log(error)
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
 