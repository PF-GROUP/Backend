import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from '../Enum/roles.enum';
import { AgencyService } from 'src/modules/agency/agency.service';

@Injectable()
export class AgencyOwnershipGuard implements CanActivate {
  constructor(
    private readonly agencyService: AgencyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userPayload = request.user;

    if (!userPayload) {
      throw new UnauthorizedException('Usuario no autenticado.');
    }

    if (userPayload.roles && userPayload.roles.includes(Role.Admin)) {
      return true;
    }

    const agencyId = request.params.agencyId;
    if (!agencyId) {
      throw new BadRequestException('ID de agencia no proporcionado en la ruta.');
    }

    const agency = await this.agencyService.findOne(agencyId);

    if (!agency || !agency.user) {
      throw new ForbiddenException('Acceso denegado: Agencia o propietario no encontrado.');
    }

    if (agency.user.id === userPayload.id) {
      return true;
    }

    throw new ForbiddenException('No tienes permisos para realizar esta acción sobre esta agencia.');
  }
}