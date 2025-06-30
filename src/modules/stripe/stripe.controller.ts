import { Body, Controller, Param, Post, Req, UseInterceptors, Get} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeWebhookInterceptor } from 'src/interceptors/rawBody.interceptor';


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
  async getAllSuscriptions() {
    const suscriptions = await this.stripeService.getAllSuscriptions();
    return {content: suscriptions, message: 'Suscripciones obtenidas exitosamente'}
  }
}
