import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { AgencyModule } from '../agency/agency.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice, Suscription } from './stripe.collections.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([Suscription,Invoice]),UserModule,
        AgencyModule
    ],
    providers:[StripeService],
    controllers:[StripeController],
    exports:[StripeService]
})
export class StripeModule {}
