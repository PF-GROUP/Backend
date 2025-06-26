import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { ImagesService } from '../modules/images/images.service'; 
import { Role } from '../Enum/roles.enum';
import { PropertyService } from 'src/modules/property/property.service';

@Injectable()
export class PropertyOwnershipGuard implements CanActivate {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly propertyService: PropertyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: { id: string; roles: Role[] } }>();
    const userId = request.user.id;
    const imageId = request.params.imageId;
    const propertyId = request.params.propertyId;

    if (request.user.roles.includes(Role.Admin)) {
      return true;
    }

    let targetPropertyId: string;

    if (imageId) {

      const image = await this.imagesService.findOneWithPropertyAndOwner(imageId);

      if (!image) {
        throw new NotFoundException(`Imagen con ID "${imageId}" no encontrada.`);
      }
      if (!image.property) { // por si hay una imagen huérfana
        throw new ForbiddenException('La imagen no está asociada a una propiedad válida.');
      }
      targetPropertyId = image.property.id;
    } else if (propertyId) {

      targetPropertyId = propertyId;
    } else {

      throw new BadRequestException('No se proporcionó ID de imagen ni ID de propiedad para la verificación.');
    }

    const property = await this.propertyService.findOneWithAgencyAndOwner(targetPropertyId);

    if (!property) {
      throw new NotFoundException(`Propiedad asociada no encontrada.`);
    }

    if (!property.agency) {
      throw new ForbiddenException('La propiedad no está asociada a una agencia válida.');
    }

    if (!property.agency.user) {
      throw new ForbiddenException('La agencia de la propiedad no tiene un usuario propietario definido.');
    }

    if (property.agency.user.id === userId) {
      return true;
    }

    throw new ForbiddenException('No tienes permisos para realizar esta acción.');
  }
}