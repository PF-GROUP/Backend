import { Injectable } from '@nestjs/common';
import * as nodeMailer  from 'nodemailer';
import {config as dotenvConfig} from "dotenv"

dotenvConfig({path: ".env.development"})
@Injectable()
export class NodeMailerService {
      private transporter: nodeMailer.Transporter;
      private allMails = ["danielgenarog@gmail.com", "soyhenryorozco@gmail.com"]
  constructor() {
    this.transporter = nodeMailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_APP_PASSWORD,
      }
    });
  }

  async sendEasyMail(destination: string, subject: string, text: string) {
    await this.sendMail({
      from: process.env.SMTP_EMAIL,
      to: destination,
      subject: subject,
      text: text,
    });
  }
  async sendEasyMailWithIcon(destination: string, subject: string, text: string, icon: string) {
    await this.sendMail({
      from: process.env.SMTP_EMAIL,
      to: destination,
      subject: subject,
      text: text,
      html: `<img src="${icon}">`
    });
  }
  async sendMail (mailOptions: nodeMailer.SendMailOptions) {
    await this.transporter.sendMail(mailOptions);
  }

  async sendEasyMailToAll(subject: string, text: string) {
    await this.sendMail({
      from: process.env.SMTP_EMAIL,
      to: this.allMails,
      subject: subject,
      text: text,
    });
  }
  async sendEasyMailToAllWithIcon(subject: string, text: string, icon: string) {
    await this.sendMail({
      from: process.env.SMTP_EMAIL,
      to: this.allMails,
      subject: subject,
      text: text,
      html: `<img src="${icon}">`
    });
  }
  async sendEasyMailWithHTML(to: string, subject: string, text: string, html: string) {
    await this.sendMail({
      from: process.env.SMTP_EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: html
    });
  }
}