import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { AgencyModule } from '../agency/agency.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice, Suscription } from './stripe.collections.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([Suscription,Invoice]),
        AgencyModule
    ],
    providers:[StripeService],
    controllers:[StripeController],
    exports:[StripeService]
})
export class StripeModule {}
