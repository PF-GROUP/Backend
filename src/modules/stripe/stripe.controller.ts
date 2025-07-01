import { Body, Controller, Param, Post, Req, UseInterceptors, Get, UseGuards} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeWebhookInterceptor } from 'src/interceptors/rawBody.interceptor';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/Enum/roles.enum';
import { RolesGuard } from 'src/guard/roles.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { IsOwnerOrAdminGuard } from 'src/guard/isOwnerOrAdmin.guard';


@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout/:id')

  async crearCheckout(@Body() body: { email: string }, @Param('id') id:string) {
    const session = await this.stripeService.crearSesionPago(body.email, id);
    return {content: session, message: 'Sesion creada exitosamente'}
  }

@Post('webhook')
@UseInterceptors(StripeWebhookInterceptor)
 handleStripeWebhook(@Req() req: Request) {
  const event = this.stripeService.getPaymentStatus(req);

  return {content: event, message: 'Evento recibido exitosamente'}

}
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  async getAllSuscriptions() {
    const suscriptions = await this.stripeService.getAllSuscriptions();
    return {content: suscriptions, message: 'Suscripciones obtenidas exitosamente'}
  }
  @Get(':id')
  @UseGuards(AuthGuard,IsOwnerOrAdminGuard)
  async getSuscription(@Param('id') id: string) {
    const suscription = await this.stripeService.getSuscriptionByAgency(id);
    return {content: suscription, message: 'Suscripcion obtenida exitosamente'}
  }
}
