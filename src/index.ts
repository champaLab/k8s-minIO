import app from './app'
import logger from './configs/winston'
import env from './env'

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(`Started server on ${env.HOST}:${env.PORT}${env.BASE_PATH}`)
})

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.')
  logger.info('Closing http server.')
  server.close(() => {
    logger.info('Http server closed.')
    process.exit(0)
  })
})
