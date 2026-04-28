import cors from 'cors'
import express from 'express'
import prom from 'prom-client'
import swaggerUi from 'swagger-ui-express'

import env from './env'
import { logRequestResponse } from './middlewares/logger-middleware'
import router from './router'
import { swaggerSpec } from './swagger'
const app = express()

const register = new prom.Registry()
register.setDefaultLabels({
  worker: env.SERVICE_NAME
})
const collectDefaultMetrics = prom.collectDefaultMetrics
collectDefaultMetrics({
  labels: { NODE_APP_INSTANCE: env.SERVICE_NAME },
  register
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) =>
  logRequestResponse(req, res, next, {
    ignorePaths: ['metrics', 'api-docs', 'openapi.json'],
    ignoreBodyKeys: [],
    hiddenBodyKeys: ['password', 'img_photo', 'upload_file_photo', 'upload_file_passport', 'img_photo', 'img_passport']
  })
)

app.use(`${env.BASE_PATH}/v1`, router)

// API documentation (Swagger UI) - `as any` bypasses @types/swagger-ui-express Express version mismatch
app.use(`${env.BASE_PATH}/api-docs`, swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any)

// OpenAPI spec (JSON) - for external tools, Postman, etc.
app.get(`${env.BASE_PATH}/openapi.json`, (_, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json(swaggerSpec)
})

app.get('/metrics', async (_, res) => {
  res.set('Content-Type', register.contentType)
  return res.send(await register.metrics())
})

app.get('/', (_, res) => {
  return res.json({
    status: 'OK',
    upTime: process.uptime(),
    timestamp: Date.now(),
    SERVICE_NAME: env.SERVICE_NAME,
    BASE_PATH: env.BASE_PATH
  })
})

export default app
