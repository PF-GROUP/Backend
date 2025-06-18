/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BadRequestException, Injectable, Body, RawBodyRequest, NotFoundException } from '@nestjs/common';
import { config as dotenvconfig } from "dotenv"
dotenvconfig({path: ".env.development"});
import Stripe from 'stripe';
import { AgencyService } from '../agency/agency.service';
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly agencyService: AgencyService) {
    this.stripe = new Stripe(`${process.env.STRIPE_SECRET}`, { apiVersion: '2025-05-28.basil' });
  }

  async crearSesionPago(email: string, agencyId: string) {
  const customerId = await this.searchOrCreateCustomer({email, agencyId});
    
  const session: Stripe.Checkout.Session = await this.stripe.checkout.sessions.create({
  success_url: 'http://localhost:3001/success',
  customer: customerId,
  customer_email: email,
  payment_method_types: ['card'],
  line_items: [
    {
      price: `${process.env.STRIPE_PRICE_ID}`,
      quantity: 1,
    },
  ],
  client_reference_id: '1234',
  mode: 'subscription',
});
  return session
  }


  async searchOrCreateCustomer(data: {email: string, agencyId: string}) {
    const {email, agencyId} = data
    const agency = await this.agencyService.findOne(agencyId);
    if (!agency) {
      throw new NotFoundException(`Agencia con ID "${agencyId}" no encontrada.`)
    }
    if (agency?.customerId){
      const existsingcustomer = await this.searchCustomer(agency.customerId);
      return existsingcustomer.id
    }
    const customer = await this.searchCustomerByEmail(email);
    if (customer.data.length > 0) {
      await this.agencyService.update(agencyId, {customerId: customer.data[0].id});
      return customer.data[0].id;
    } else {
      const customer = await this.createCustomer(email);
      await this.agencyService.update(agencyId, {customerId: customer.id});
      return customer.id;
    }
  }
async createCustomer(email: string) {
  const customer = await this.stripe.customers.create({
    email: email,
  });
  return customer
}
async searchCustomerByEmail(email: string) {
  try {
    const customer = await this.stripe.customers.list({
      email: email,
    });
    return customer
  } catch  {
    throw new BadRequestException("Hubo un error al buscar el cliente");
  }
}
async searchCustomer(customerId: string) {
  try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return customer
  } catch  {
    throw new BadRequestException("Hubo un error al buscar el cliente");
  }
}

async getPaymentStatus(request: RawBodyRequest<Request> & { stripeRawBody?: Buffer }) {
    const sig = request.headers['stripe-signature'] as string;
    const rawBody = request.stripeRawBody || request.body;

    if (!Buffer.isBuffer(rawBody)) {
      console.log('Raw body:', rawBody);
      throw new BadRequestException('Invalid request body');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, sig, `${process.env.STRIPE_WEBHOOK_SECRET}`);
    } catch (error) {
      console.error('Stripe webhook error:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException('Webhook Error: ' + error.message);
    }

    console.log('Event type:', event.type);

    switch (event.type) {
      case 'charge.succeeded':
        await this.handleChargeSucceeded(event.data.object);
        break;
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object );
        break;
      case 'payment_intent.succeeded':
        console.log('PaymentIntent succeeded:', event.data.object);
        break;
      case 'payment_method.attached':
        console.log('PaymentMethod attached:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

private async handleCheckoutSessionCompleted(session : Stripe.Checkout.Session) {
 await Promise.resolve(session).then((session) => {
    console.log(session);
  }).catch((error) => {
    console.error(error);
  })
}
private async handleChargeSucceeded(charge: Stripe.Charge) {
  await Promise.resolve(charge).then((charge) => {
    console.log(charge);
  }).catch((error) => {
    console.error(error);
  })  

}

}


