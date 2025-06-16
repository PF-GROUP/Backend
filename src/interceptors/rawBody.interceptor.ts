/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class StripeWebhookInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const req: any = context.switchToHttp().getRequest();

    const rawBody = req.rawBody;

    if (req.url === '/stripe/webhook' && rawBody) {
      // El cuerpo ya está en formato raw gracias al middleware en main.ts
      req.stripeRawBody = rawBody;
    }

    return next.handle();
  }
}