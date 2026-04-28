import * as dotenv from 'dotenv'

dotenv.config()

export default {
  SERVICE_NAME: process.env.SERVICE_NAME || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: parseInt(`${process.env.NODE_PORT}`) || 8080,
  BASE_PATH: process.env.BASE_PATH || '/api',
  TZ: process.env.TZ || 'Aisa/Bangkok',
  PWD: process.env.PWD || process.cwd(),
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT || '3306'),
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_SCHEMA: process.env.DB_SCHEMA,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  PRIVATE_KEY: `${process.env.PRIVATE_KEY}`,
  PUBLIC_KEY: `${process.env.PUBLIC_KEY}`,
  S3_REGION: process.env.S3_REGION || 'us-east-1',
  S3_ENDPOINT: process.env.S3_ENDPOINT || '',
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || '',
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || '',
  S3_BUCKET: process.env.S3_BUCKET || '',
  S3_FORCE_PATH_STYLE: (process.env.S3_FORCE_PATH_STYLE || 'false').toLowerCase() === 'true',
}
