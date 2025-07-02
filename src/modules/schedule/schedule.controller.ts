// schedule.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

@Post('subscribe')
async subscribe(@Body('email') email: string) {
  if (!email) throw new BadRequestException('Email requerido');
  await this.scheduleService.subscribeToNewsletter(email);
  return 'Gracias por suscribirte a nuestro newsletter!';
}
}