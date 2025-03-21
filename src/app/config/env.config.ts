import dotenv from 'dotenv';
import path from 'path';
import * as process from 'node:process';

// Determine which environment file to use
const envFile = `.env.dev`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const ENV_CONFIG = {
  server: {
    port: process.env.SERVER_PORT || 5000,
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === 'true',
    service: process.env.MAIL_SERVICE,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
  },
  file:{
    connectionString:process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName:process.env.AZURE_CONTAINER_NAME
  },
  vnpay: {
    tmnCode: process.env.VNPAY_TMNCODE,
    hashSecret: process.env.VNPAY_HASH_SECRET
  }
};
