// aca va a ir el auth de que el usuario pertenece a la agencia

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { User } from "../user/user.entity";

@Injectable()
export class AgencyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} 
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>() as any;
        const user: User = request.user;
    
        if(!user) {
            throw new ForbiddenException('Acceso denegado: Usuario no autenticado');}
    
        if(user.isAdmin) {
            return true; 
        }

        if(!user.agency) {
            throw new ForbiddenException('Acceso denegado: Usuario no pertenece a una agencia');
        }

            const agencyId = request.params.agencyId;
    if (agencyId && user.agency.id !== parseInt(agencyId)) {
      throw new UnauthorizedException('No tienes permisos para esta agencia');
    }
        return true; 
    }
}