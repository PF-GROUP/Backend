import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from 'src/Enum/roles.enum';
import { JwtPayload } from 'src/Interface/jwtpayload'; 

@Injectable()
export class IsOwnerOrAdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    const requestedId = request.params.userId;

    if (!user) {
      throw new ForbiddenException('Acceso denegado: Usuario no autenticado.'); // Esto no debería suceder si AuthGuard precede.
    }

    const isOwner = user.id === requestedId;

    const isAdmin = user.roles && user.roles.includes(Role.Admin);

    if (isOwner || isAdmin) {
      return true;
    }

    throw new ForbiddenException('No tienes permiso para acceder a este recurso.');
  }
}