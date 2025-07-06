import { forwardRef, Module } from '@nestjs/common';
import { CustomizationService } from './customization.service';
import { CustomizationController } from './customization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customization } from './customization.entity';
import { Agency } from 'src/modules/agency/agency.entity';

import { UserModule } from '../user/user.module';
import { AgencyModule } from '../agency/agency.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customization, Agency ]),UserModule, forwardRef(() => AgencyModule)],
  controllers: [CustomizationController],
  providers: [CustomizationService],
  exports: [CustomizationService, TypeOrmModule],
})
export class CustomizationModule {}
