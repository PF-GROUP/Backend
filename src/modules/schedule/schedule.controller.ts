// schedule.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('subscribe')
  async subscribe(@Body() email: string) {
    await this.scheduleService.sendEveryFiveMinutes();
    return 'Gracias por suscribirte a nuestro newsletter!';
  }
}