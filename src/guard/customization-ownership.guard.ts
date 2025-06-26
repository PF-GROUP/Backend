import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '../Enum/roles.enum'; 
import { CustomizationService } from 'src/modules/customization/customization.service'; 

@Injectable()
export class CustomizationOwnershipGuard implements CanActivate {
  constructor(
    private readonly customizationService: CustomizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user: { id: string; roles: Role[] } }>();
    const userPayload = request.user;

    if (!userPayload) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    if (userPayload.roles && userPayload.roles.includes(Role.Admin)) {
      return true;
    }

    const customizationId = request.params.customizationId;
    if (!customizationId) {
      throw new BadRequestException('ID de customización no proporcionado en la ruta.');
    }

    const customization = await this.customizationService.findOneWithAgencyAndOwner(customizationId);

    if (!customization) {
      throw new NotFoundException(`Customización con ID "${customizationId}" no encontrada.`);
    }

    if (!customization.agency) {
      throw new ForbiddenException('La customización no está asociada a una agencia válida.');
    }

    if (!customization.agency.user) {
      throw new ForbiddenException('La agencia asociada a la customización no tiene un usuario propietario definido.');
    }

    if (customization.agency.user.id === userPayload.id) {
      return true;
    }

    throw new ForbiddenException('No tienes permisos para realizar esta acción sobre esta customización.');
  }
}