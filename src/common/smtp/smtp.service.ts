import nodemailer from "nodemailer";
import { getEnvField } from "../../config/env.config.js";

export interface SendMailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export class SmtpService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: getEnvField.SMTP_HOST,
            port: parseInt(getEnvField.SMTP_PORT),
            secure: getEnvField.SMTP_SECURE === "true",
            auth: {
                user: getEnvField.SMTP_USER,
                pass: getEnvField.SMTP_PASS,
            },
        });
    }

    async sendMail(options: SendMailOptions): Promise<void> {
        await this.transporter.sendMail({
            from: getEnvField.SMTP_USER,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
    }
}