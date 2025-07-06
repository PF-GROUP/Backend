/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BadRequestException, Injectable, Body, RawBodyRequest, NotFoundException } from '@nestjs/common';
import { config as dotenvconfig } from "dotenv"
dotenvconfig({path: ".env.development"});
import Stripe from 'stripe';
import { AgencyService } from '../agency/agency.service';
import { Invoice, Suscription } from './stripe.collections.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from '../agency/agency.entity';
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly agencyService: AgencyService,     @InjectRepository(Suscription) private readonly suscriptionRepository: Repository<Suscription>, @InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>) {
    this.stripe = new Stripe(`${process.env.STRIPE_SECRET}`, { apiVersion: '2025-05-28.basil' });
  }
  async crearSesionPago(email: string, agencyId: string) {
  const customerId = await this.searchOrCreateCustomer({email, agencyId});
    
 try {
   const session: Stripe.Checkout.Session = await this.stripe.checkout.sessions.create({
   success_url:  `${process.env.CLIENT_URL}/success`,
   cancel_url: `${process.env.CLIENT_URL}/cancel`,
   customer: customerId,
   payment_method_types: ['card'],
   line_items: [
     {
       price: `${process.env.STRIPE_PRICE_ID}`,
       quantity: 1,
     },
   ],

   mode: 'subscription',
 });

 return session
 } catch (error) {
  throw new BadRequestException("Hubo un error al crear la sesion de pago");

 }
  }


  async searchOrCreateCustomer(data: {email: string, agencyId: string}) {
    const {email, agencyId} = data
    const agency = await this.agencyService.findOne(agencyId);
    if (!agency) {
      throw new NotFoundException(`Agencia con ID "${agencyId}" no encontrada.`)
    }
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


    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      await this.handleSuscriptionEvent(event.data.object, event.type);
      break;
      case 'payment_intent.succeeded':
        await this.handleChargeSucceeded(event.data.object);
        break;
      case 'invoice.paid':
      case 'invoice.finalized':
      case 'invoice.payment_failed':
      case 'invoice.payment_succeeded':
      await this.handleInvoiceEvent(event.data.object as Stripe.Invoice & {subscription : Stripe.Subscription});
      break;
      // case 'payment_intent.payment_failed':
      //   await this.handleChargeFailed(event.data.object);  
      //   break;
      // case 'payment_intent.canceled':
      //   await this.handleChargeCanceled(event.data.object);
      //   break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
  async handleChargeFailed(object: Stripe.PaymentIntent & {subscription : Stripe.Subscription}) {
    if (!object.subscription) {
      return;
    }
    const suscription = object.subscription ;
    await this.handleSuscriptionEvent(suscription, "customer.subscription.created");
  }

async handleInvoiceEvent(object: Stripe.Invoice & { subscription: Stripe.Subscription }) {
  if (object.billing_reason === "subscription_create" || object.billing_reason === "subscription_update" || object.billing_reason === "subscription") {
  const queryRunner = this.invoiceRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // 1. Recuperar suscripción local
    const customerId = object.customer as string;
    const susList = await this.getSuscriptionByCustomer(customerId);
    const sus = susList.find(s => s.suscriptionId === object.subscription.id);
    if (!sus) {
      await queryRunner.rollbackTransaction();
      return;
    }

    // 2. Crear o actualizar invoice
    const invRepo = queryRunner.manager.getRepository(Invoice);
    const invoiceData: Partial<Invoice> = {
      invoiceId: object.id,
      status: object.status ? object.status : undefined,
      suscription: sus,
      amount: object.total,
      currency: object.currency,
      createdAt: new Date(object.created * 1000),
    };
    await invRepo.save(invoiceData);


    // 3. (Opcional) Actualizar estado de la suscripción o agencia según status
    // e.g. si object.status==='payment_failed' podrías marcar algo en Suscription
    if (object.status) {
      await queryRunner.manager.getRepository(Suscription).update(sus.id, { status: object.status });
    }

    await queryRunner.commitTransaction();
  } catch (err) {
    console.log(err);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
}
}
private async handleCheckoutSessionCompleted(session : Stripe.Checkout.Session) {

if (session.mode === "subscription") {
   const suscription = await this.stripe.subscriptions.retrieve(session.subscription as string);
   await this.handleSuscriptionEvent(suscription, "customer.subscription.created");
   if (session.invoice){
    const invoice = await this.stripe.invoices.retrieve(session.invoice as string);
    await this.createOrUpdate(invoice);
   }
}


}
private async createOrUpdate(invoice: Stripe.Invoice) {
if (invoice.billing_reason === "subscription_create" || invoice.billing_reason === "subscription_update" || invoice.billing_reason === "subscription") {
  const queryRunner = this.invoiceRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // 1. Recuperar suscripción local
    const customerId = invoice.customer as string;
    const susList = await this.getSuscriptionByCustomer(customerId);
    const sus = susList[0] // solo debería haber una suscripción por customer
    if (!sus) {
      await queryRunner.rollbackTransaction();
      return;
    }

    // 2. Crear o actualizar invoice
    const invoiceData: Partial<Invoice> = {
      invoiceId: invoice.id,
      status: invoice.status ? invoice.status : undefined,
      suscription: sus,
      amount: invoice.total,
      suscriptionId: sus.suscriptionId,
      currency: invoice.currency,
      createdAt: new Date(invoice.created * 1000),
    };
    const inv = await queryRunner.manager.getRepository(Invoice).findOne({ where: { invoiceId: invoice.id } });
    if (inv) {
      await queryRunner.manager.getRepository(Invoice).update(inv.id, invoiceData);
    }else{
      await queryRunner.manager.getRepository(Invoice).save(invoiceData);
    }

    if (invoice.status) {
      await queryRunner.manager.getRepository(Suscription).update(sus.id, { status: invoice.status });
    }

    await queryRunner.commitTransaction();
  } catch (err) {
    console.log(err);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
  
}
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
  const queryRunner = this.suscriptionRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const existingSuscription = await this.suscriptionRepository.findOne({where: {suscriptionId: suscription.id}});
    if (existingSuscription) {
      await queryRunner.manager.getRepository(Suscription).update(existingSuscription.id, {
        status: suscription.status,
        currentPeriodEnd: suscription.current_period_end ? new Date(suscription.current_period_end * 1000) : undefined,
        updatedAt: new Date(),
      });
      await queryRunner.commitTransaction();
      return;
    }
    // 1. Crear o actualizar la suscripción
    const agency = await this.agencyService.findOneByCustomerId(suscription.customer as string);
    const existsingSuscription = await this.suscriptionRepository.findOne({where: {agency: {id: agency.id}}});
    if(existsingSuscription){
      await queryRunner.manager.getRepository(Suscription).update(existsingSuscription.id, {
        status: suscription.status,
        currentPeriodEnd: suscription.current_period_end ? new Date(suscription.current_period_end * 1000) : undefined,
        updatedAt: new Date(),
      });
    }
    const subsData: Partial<Suscription> = {
      suscriptionId: suscription.id,
      status: suscription.status,
      agency: agency,
      planId: suscription.items.data[0].price.id,
      currentPeriodEnd: suscription.current_period_end ? new Date(suscription.current_period_end * 1000) : undefined,
      updatedAt: new Date(),
    };
    await queryRunner.manager.getRepository(Suscription).save(subsData);

    // 2. Marcar onboarding
    await queryRunner.manager.getRepository(Agency).update(agency.id, { onBoarding: false });
    //obbtener invoice
    if (suscription.latest_invoice) {
      const invoice = await this.stripe.invoices.retrieve(suscription.latest_invoice as string);
      await this.createOrUpdate(invoice);
    }

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.log(err);
  } finally {
    await queryRunner.release();
  }
}
private async deleteSubscription(suscription: Stripe.Subscription) {
  await this.suscriptionRepository.softDelete({suscriptionId: suscription.id})
}

async getAllSuscriptions(){
  return this.suscriptionRepository.find({relations:['invoice','agency']});
}

async getSuscriptionByCustomer(customerId: string){ 
  const agency = await this.agencyService.findOneByCustomerId(customerId); 
  return await this.suscriptionRepository.find({where: {agency: agency}});
}
async getSuscriptionByAgency(agencyId: string){
  return await this.suscriptionRepository.find({where: {agency: {id: agencyId}}, relations: ['Invoice']});
}

private async handleChargeSucceeded(charge: Stripe.PaymentIntent & {subscription?: string}) {
  if (!charge.subscription) {
    return;
  }
  const suscription = await this.stripe.subscriptions.retrieve(charge.subscription);
  await this.createOrUpdateSubscription(suscription);

}

}




