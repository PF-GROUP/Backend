

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/Enum/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context:ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {   
        const request = context.switchToHttp().getRequest<Request & { user: { roles: Role[] } }>();

        const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass()
        ]);

        const user = request.user as { roles: Role[] };

        const hasRole = () => roles.some((role) => user.roles.includes(role));

        const valid: boolean = user && user.roles && hasRole();
        if (!valid) 
            throw new ForbiddenException("No tienes los permisos necesarios para acceder a este recurso");
            return valid;
        
        
    }
}   