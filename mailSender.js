import nodemailer from "nodemailer";
import { env } from "./db";

export class MailSender {
    transporter;
    mailOptions = {
        from: "",
        to: "",
        subject: "",
        text: ""
    }

    mailerSetup = ({ subject, text, to }) => {
        this.transporter = nodemailer.createTransport({
            service: env.MAIL_SERVICE,
            auth: {
                user: env.MAIL_USER,
                pass: env.MAIL_PASSWORD
            }
        });

        this.mailOptions = {
            from: env.MAIL_USER,
            to,
            subject,
            text
        }
    }

    sendingMail = (payload) => {
        this.mailerSetup(payload);
        this.transporter.sendMail(this.mailOptions, (error, info) => {
            if (error) {
                console.log("error - mailing ", error);
            }
        })
    }
}
