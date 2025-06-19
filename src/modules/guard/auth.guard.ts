
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/Interface/jwtpayload';
import { Role } from 'src/Enum/roles.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "../user/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
      const payload = this.jwtService.verify<JwtPayload>(token, { secret });

      
      const user = await this.userRepository.findOne({
         where: { id: Number(payload.id) },
         relations: ['agency'] 
        });

        if (!user) {
      throw new UnauthorizedException('User not found');}
      
      const updatedPayload: JwtPayload = {
        ...payload,
        agencyId: user.agency?.id, 
        roles: user.isAdmin ? [Role.Admin] : [Role.User],
      };

      request.user = updatedPayload;

    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
 