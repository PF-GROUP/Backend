/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BadRequestException, Injectable, Body, RawBodyRequest, NotFoundException } from '@nestjs/common';
import { config as dotenvconfig } from "dotenv"
dotenvconfig({path: ".env.development"});
import Stripe from 'stripe';
import { AgencyService } from '../agency/agency.service';
import { Suscription } from './stripe.collections.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly agencyService: AgencyService,     @InjectRepository(Suscription) private readonly suscriptionRepository: Repository<Suscription>) {
    this.stripe = new Stripe(`${process.env.STRIPE_SECRET}`, { apiVersion: '2025-05-28.basil' });
  }

  async crearSesionPago(email: string, agencyId: string) {
  const customerId = await this.searchOrCreateCustomer({email, agencyId});
    
  const session: Stripe.Checkout.Session = await this.stripe.checkout.sessions.create({
  success_url: 'http://localhost:3001/success',
  customer: customerId,
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
    console.log("SEXOOOO")
    if (agency?.stripeCustomerId){
      const existingcustomer = await this.searchCustomer(agency.stripeCustomerId);
      return existingcustomer.id
    }
    const customer = await this.searchCustomerByEmail(email);
    if (customer.data.length > 0) {
      await this.agencyService.updateCustomerId(agencyId,customer.data[0].id);
      return customer.data[0].id;
    } else {
      const customer = await this.createCustomer(email);
      await this.agencyService.updateCustomerId(agencyId,customer.id);
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
    console.log("TRIOOO")
    const customer = await this.stripe.customers.list({
      email: email,
    });
    console.log("TE PUSEEE EN 4")
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
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      await this.handleSuscriptionEvent(event.data.object, event.type);
      break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

private async handleCheckoutSessionCompleted(session : Stripe.Checkout.Session) {
 const suscription = await this.stripe.subscriptions.retrieve(session.subscription as string);
 await this.handleSuscriptionEvent(suscription, "customer.subscription.created");
}

private async handleSuscriptionEvent(suscription: Stripe.Subscription, eventType: "customer.subscription.created" | "customer.subscription.updated" | "customer.subscription.deleted") {
  switch(eventType){
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await this.createOrUpdateSubscription(suscription);
      break;
    case "customer.subscription.deleted":
      await this.deleteSubscription(suscription);
      break;
  }
 
}

private async createOrUpdateSubscription(suscription: Stripe.Subscription & {current_period_end?: number | null}) {

  const agency = await this.agencyService.findOneByCustomerId(suscription.customer as string);
  const sucriptionData:Partial<Suscription> = {
    suscriptionId: suscription.id,
    status: suscription.status,
    agency: agency,
    planId: suscription.items.data[0].price.id,
    currentPeriodEnd: suscription.current_period_end ? new Date(suscription.current_period_end * 1000) : undefined,
    createdAt: new Date(suscription.created * 1000),
    updatedAt: new Date()
  }
  const existsSuscription = await this.suscriptionRepository.findOne({where: {suscriptionId: suscription.id}});
  if (existsSuscription) {
    await this.suscriptionRepository.update(existsSuscription.id, sucriptionData);
  } else{
    await this.suscriptionRepository.insert(sucriptionData);
  }
  await this.agencyService.update(agency.id, {onBoarding: false})
}
private async deleteSubscription(suscription: Stripe.Subscription) {
  await this.suscriptionRepository.softDelete({suscriptionId: suscription.id})
}

async getAllSuscriptions(){
  return this.suscriptionRepository.find();
}

async getSuscriptionByCustomer(customerId: string){ 
  const agency = await this.agencyService.findOneByCustomerId(customerId); 
  return await this.suscriptionRepository.find({where: {agency: agency}});
} 
private async handleChargeSucceeded(charge: Stripe.Charge) {
  await Promise.resolve(charge).then((charge) => {
    console.log(charge);
  }).catch((error) => {
    console.error(error);
  })  

}

}




