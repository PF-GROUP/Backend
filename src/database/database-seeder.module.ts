import { Module } from '@nestjs/common';

import { DatabaseSeederService } from './database.seeder.service';
;
import { TypeofpropertyModule } from 'src/modules/typeOfProperty/typeofproperty.module';
import { AgencyModule } from 'src/modules/agency/agency.module';
import { PropertyModule } from 'src/modules/property/property.module';
import { ImagesModule } from 'src/modules/images/images.module';
import { UserModule } from 'src/modules/user/user.module';
import { StripeModule } from 'src/modules/stripe/stripe.module';

@Module({
  imports: [
    UserModule,TypeofpropertyModule,AgencyModule,PropertyModule,ImagesModule,StripeModule
  ],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseSeederModule {}
