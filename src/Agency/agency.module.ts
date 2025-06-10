import { Module } from '@nestjs/common';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';

@Module({
  controllers: [AgencyController],
  providers: [AgencyService],
})
export class AgencyModule {}
