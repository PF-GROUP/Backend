import { Body, Controller, Param, Post, Req, UseInterceptors, Get} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeWebhookInterceptor } from 'src/interceptors/rawBody.interceptor';


@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout/:id')

  crearCheckout(@Body() body: { email: string }, @Param('id') id:string) {
    return this.stripeService.crearSesionPago(body.email, id);
  }

@Post('webhook')
@UseInterceptors(StripeWebhookInterceptor)
 handleStripeWebhook(@Req() req: Request) {
  return this.stripeService.getPaymentStatus(req);

}
  @Get()
  async getAllSuscriptions() {
    return await this.stripeService.getAllSuscriptions();
  }
}
