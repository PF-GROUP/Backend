import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { NodeMailerModule } from '../node-mailer/node-mailer.module';
import { UserModule } from '../user/user.module';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [NodeMailerModule, UserModule],
  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
