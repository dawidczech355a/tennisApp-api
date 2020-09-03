import nodemailer from 'nodemailer';
import { env } from '../environment';
import Mail from 'nodemailer/lib/mailer';

interface IMailOptions {
  from?: string;
  to: string;
  subject: string;
  text: string;
}

export class MailSender {
  transporter: Mail;
  mailOptions: IMailOptions = {
    from: '',
    to: '',
    subject: '',
    text: '',
  };

  mailerSetup = ({ subject, text, to }: IMailOptions) => {
    this.transporter = nodemailer.createTransport({
      service: env.MAIL_SERVICE,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASSWORD,
      },
    });

    this.mailOptions = {
      from: env.MAIL_USER,
      to,
      subject,
      text,
    };
  };

  sendingMail = (payload: IMailOptions) => {
    this.mailerSetup(payload);
    this.transporter.sendMail(this.mailOptions, (error: Error) => {
      if (error) {
        console.log('error - mailing ', error);
      }
    });
  };
}
