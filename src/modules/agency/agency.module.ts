import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './agency.entity';
import { UserModule } from '../user/user.module';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { AgencyGuard } from '../../guard/agency.guard';
import { CustomizationModule } from '../customization/customization.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Agency]),
    forwardRef(() => UserModule),
    forwardRef(() => CustomizationModule)
  ],
  controllers: [AgencyController],
  providers: [AgencyService, AgencyGuard],
  exports: [AgencyService],
})
export class AgencyModule {}
