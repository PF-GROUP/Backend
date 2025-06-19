import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { AgencyModule } from '../agency/agency.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suscription } from './stripe.collections.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([Suscription]),
        AgencyModule
    ],
    providers:[StripeService],
    controllers:[StripeController]
})
export class StripeModule {}
