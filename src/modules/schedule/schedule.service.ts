import { NodeMailerService } from './../node-mailer/node-mailer.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
    constructor(private readonly mailerService: NodeMailerService ){}


    @Cron('0 0 * * * *')
    async sendEveryHour(){
        await this.mailerService.sendEasyMailToAll("Esto es una prueba", "Esto es una prueba");
    }
}
