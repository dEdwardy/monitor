import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly config: ConfigService,
  ) {}
  sendMail(options: ISendMailOptions) {
    return this.mailService.sendMail(options);
  }
  sendToMe({ title, url, img } = { title: '', url: '', img: '' }) {
    const options: ISendMailOptions = {
      to: '957196958@qq.com',
      from: this.config.get('MAIL_USER'),
      subject: 'Something new~',
      template: 'up-remind',
      sender: 'Code',
      context: {
        title,
        url,
        img,
      },
    };
    return this.sendMail(options);
  }
}
