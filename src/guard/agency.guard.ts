// aca va a ir el auth de que el usuario pertenece a la agencia

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";

import { Request } from "express";
import { User } from "../modules/user/user.entity";
import { UserService } from "../modules/user/user.service";

    @Injectable()
    export class AgencyGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    ) {} 

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>() as Request & { user: User };
        const user: User = request.user;
    
        if(user.isAdmin) {
            return true; 
        }
 
        const fullUser = await this.userService.findOneWithAllRelations(user.id);
        if(!fullUser.agency) {
            throw new ForbiddenException('Acceso denegado: Usuario no pertenece a una agencia');
        }
 
        const agencyId = request.params.id;

        if (agencyId && fullUser.agency.id !== agencyId) {
         throw new UnauthorizedException('No tienes permisos para esta agencia');
        }
        return true; 
        }
}