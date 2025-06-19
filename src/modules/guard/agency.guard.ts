// aca va a ir el auth de que el usuario pertenece a la agencia

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { User } from "../user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Agency } from "../agency/agency.entity"; // Assuming you have an Agency entity

    @Injectable()
    export class AgencyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agency) 
    private readonly agencyRepository: Repository<Agency>
    ) {} 

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>() as Request & { user: User };
        const user: User = request.user;
    
        if(!user) {
            throw new ForbiddenException('Acceso denegado: Usuario no autenticado');}
    
        if(user.isAdmin) {
            return true; 
        }

        const fullUser = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['agency'] 
        });

        if(!fullUser) {
            throw new ForbiddenException('Acceso denegado: Usuario no encontrado');
        }

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