import { Injectable } from '@nestjs/common';
import * as nodeMailer  from 'nodemailer';
import {config as dotenvConfig} from "dotenv"
import { readFile } from 'fs/promises'; 
import { join } from 'path';
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



private async loadTemplate(templateName: string, data: Record<string, string>) {
  try {
    const templatePath = join(process.cwd(), 'src', 'modules', 'node-mailer', 'templates', templateName);
    let html = await readFile(templatePath, 'utf8'); // 👈 ¡Ahora con await!

    // Reemplaza variables dinámicas
    Object.keys(data).forEach(key => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    });

    return html;
  } catch (error) {
    throw new Error(`Error al cargar el template: ${error}`);
  }
}

async sendMailRegistered(mail: string, name: string, surname: string) {
  try {
    const html = await this.loadTemplate('welcome-email.html', {
      name,
      surname,
      clientUrl: process.env.CLIENT_URL || 'https://default-url.com',
    });

    await this.sendEasyMailWithHTML(
      mail,
      'Bienvenido a la plataforma de Kasapp',
      'Bienvenido a la plataforma de Kasapp',
      html,
    );
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error; // O maneja el error según tu lógica
  }
}
}