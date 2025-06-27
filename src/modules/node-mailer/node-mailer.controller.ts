import { Controller, Param, Post } from '@nestjs/common';
import { NodeMailerService } from './node-mailer.service';

@Controller('mailer')
export class NodeMailerController {
    constructor(private readonly nodeMailerService: NodeMailerService) {}
    @Post()
    async sendMail () {
       await this.nodeMailerService.sendMail({subject: "Hello", text: "Hello world", from: "test", to: "danielgenarog@gmail.com", html: "<h1>test</h1>"}); 
       return {message: "Mail enviado correctamente"}
    }
    @Post("all/:subject/:text")
    async sendEasyMailToAll (@Param("subject") subject: string, @Param("text") text: string) {
       await this.nodeMailerService.sendEasyMailToAll(subject, text);
       return {message: "Mails enviados correctamente"} 
    }
    @Post(":to/:subject/:text")
    async sendEasyMail (@Param("to") to: string, @Param("subject") subject: string, @Param("text") text: string) {
       await this.nodeMailerService.sendEasyMail(to, subject, text);
       return {message: "Mail enviado correctamente"} 
    }
    @Post(":to/:subject/:text/:icon")
    async sendEasyMailWithIcon (@Param("to") to: string, @Param("subject") subject: string, @Param("text") text: string, @Param("icon") icon: string) {
       await this.nodeMailerService.sendEasyMailWithIcon(to, subject, text, icon);
       return {message: "Mail enviado correctamente"} 
    }
}
