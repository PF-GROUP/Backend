import { NodeMailerService } from './../node-mailer/node-mailer.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from '../user/user.service';

@Injectable()
export class ScheduleService {
    constructor(private readonly mailerService: NodeMailerService,
                private readonly userService: UserService
     ){}
async subscribeToNewsletter(email: string) {
  await this.userService.addUserToNewsletter(email);
}
@Cron('*/5 * * * *') 
async sendNewsletterToSubscribedUsers() {
  const users = await this.userService.getNewsletterUsers();
  for (const user of users) {
    await this.mailerService.sendEasyMail(
      user.email,
      'Newsletter de Kasapp',
      'Este es un mensaje automático enviado cada 5 minutos.'
    );
  }
}
}
