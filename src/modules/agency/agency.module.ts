import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './agency.entity';
import { UserModule } from '../user/user.module';
import { GuardModule } from '../guard/guard.module';

@Module({
  imports: [TypeOrmModule.forFeature([Agency]), UserModule, GuardModule],
  controllers: [AgencyController],
  providers: [AgencyService],
  exports:[AgencyService]
})
export class AgencyModule {}
