// aca va a ir el auth de que el usuario pertenece a la agencia

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";

import { Request } from "express";
import { User } from "../user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Agency } from "../agency/agency.entity"; // Assuming you have an Agency entity
import { UserService } from "../user/user.service";

    @Injectable()
    export class AgencyGuard implements CanActivate {
  constructor(

    @InjectRepository(User) 
    private readonly userService: UserService,
    @InjectRepository(Agency) 
    private readonly agencyRepository: Repository<Agency>
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