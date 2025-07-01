import { NodeMailerService } from './../node-mailer/node-mailer.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from '../user/user.service';

@Injectable()
export class ScheduleService {
    constructor(private readonly mailerService: NodeMailerService,
                private readonly userService: UserService
     ){}

     async sendWelcomeEmail(email: string) {
        await this.mailerService.sendEasyMail(email, "Bienvenido a nuestra plataforma", "Gracias por registrarte!");
     }
    @Cron('*/5 * * * *')
    async sendEveryFiveMinutes(){
    const emails = await this.userService.getNonAdminUserEmails();
    for (const email of emails) {
        await this.sendWelcomeEmail(email);
        await this.mailerService.sendEasyMail(email, "NewsLetter", "Esto es una prueba");
    }
}}
