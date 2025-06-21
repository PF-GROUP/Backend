import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ImagesService } from '../modules/images/images.service'; 
import { Role } from '../Enum/roles.enum';

@Injectable()
export class PropertyOwnershipGuard implements CanActivate {
  constructor(private readonly imagesService: ImagesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: { id: string; roles: Role[] } }>();
    const userId = request.user.id;
    const imageId = request.params.id;

    if (request.user.roles.includes(Role.Admin)) {
      return true;
    }

    const image = await this.imagesService.findOneWithPropertyAndOwner(imageId);

    if (!image) {
      throw new NotFoundException(`Imagen con ID "${imageId}" no encontrada.`);
    }

    if (!image.property) {//por si hay una imagen huerfana :)
      throw new ForbiddenException('La imagen no está asociada a una propiedad válida.');
    }

    if (!image.property.agency) { //por si sigue huerfano pero sin agency
      throw new ForbiddenException('La propiedad de la imagen no está asociada a una agencia válida.');
    }

    if (!image.property.agency.user) {
        throw new ForbiddenException('La agencia de la propiedad no tiene un usuario propietario definido.');
    }

    if (image.property.agency.user.id === userId) {
      return true;
    }

    throw new ForbiddenException('No tienes permisos para realizar esta acción sobre esta imagen.');
  }
}