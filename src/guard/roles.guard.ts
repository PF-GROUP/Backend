

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Role } from "src/Enum/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user: { roles: Role[], isAdmin: boolean } }>();
    const user = request.user;

    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!user) {
      throw new ForbiddenException("Usuario no autenticado");
    }

    // Si el usuario es admin, permitir acceso
    if (user.isAdmin) {
      return true;
    }

    // Si no hay roles requeridos, permitir acceso
    if (!roles || roles.length === 0) {
      return true;
    }

    const hasRole = roles.some(role => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException("No tienes los permisos necesarios para acceder a este recurso");
    }

    return true;
  }
}