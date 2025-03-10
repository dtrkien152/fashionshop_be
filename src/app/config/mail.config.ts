import nodemailer from 'nodemailer';
import { ENV_CONFIG } from './env.config';

const TRANSPORTER = nodemailer.createTransport({
  host: ENV_CONFIG.mail.host,
  port: ENV_CONFIG.mail.port,
  secure: ENV_CONFIG.mail.secure, // true for 465, false for other ports
  service: ENV_CONFIG.mail.service,
  auth: {
    user: ENV_CONFIG.mail.user,
    pass: ENV_CONFIG.mail.password,
  },
} as any);

export { TRANSPORTER };
