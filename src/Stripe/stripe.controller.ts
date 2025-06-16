import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeWebhookInterceptor } from 'src/interceptors/rawBody.interceptor';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  crearCheckout(@Body() body: { email: string }) {
    return this.stripeService.crearSesionPago(body.email);
  }

@Post('webhook')
@UseInterceptors(StripeWebhookInterceptor)
 handleStripeWebhook(@Req() req: Request) {
  return this.stripeService.getPaymentStatus(req);

}
}
