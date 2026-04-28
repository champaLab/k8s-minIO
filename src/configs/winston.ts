import fs from 'fs-extra'
import { join } from 'path'
import winston, { format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import env from '../env'
import { logNamespace } from '../middlewares/logger-middleware'

const logDirectory = join(process.cwd(), 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify(
      {
        timestamp,
        level: `${level}`.toUpperCase(),
        message,
        requestId: logNamespace?.get('requestId'),
        tracingData: logNamespace?.get('tracingData'),
        username: logNamespace?.get('username'),
        user_id: logNamespace?.get('user_id'),
        user_type: logNamespace?.get('user_type'),
        user_type_name: logNamespace?.get('user_type_name'),
        ...meta
      },
      null,
      env.NODE_ENV === 'production' ? 0 : 4
    )
  })
)

const logger = winston.createLogger({
  level: 'verbose',
  format: customFormat,
  transports: [
    new transports.Console({
      format: format.colorize({ all: env.NODE_ENV === 'development' })
    }),
    new DailyRotateFile({
      filename: `${env.SERVICE_NAME}-%DATE%.log`,
      dirname: logDirectory,
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m', // 50MB max file size
      maxFiles: '14d', // Retain logs for 14 days
      zippedArchive: true // Compress logs to .gz files
    })
  ],
  defaultMeta: {
    service: env.SERVICE_NAME
    // base_path: env.BASE_PATH,
    // environment: env.NODE_ENV,
  }
})

export default logger
