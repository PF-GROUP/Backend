import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { AgencyModule } from '../agency/agency.module';

@Module({
    imports:[
        AgencyModule
    ],
    providers:[StripeService],
    controllers:[StripeController]
})
export class StripeModule {}
