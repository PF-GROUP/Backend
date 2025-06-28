import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { NodeMailerModule } from '../node-mailer/node-mailer.module';

@Module({
  imports: [NodeMailerModule],
  providers: [ScheduleService]
})
export class ScheduleModule {}
