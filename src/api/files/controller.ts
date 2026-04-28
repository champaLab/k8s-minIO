import { randomUUID } from 'crypto'
import { Request, Response } from 'express'
import multer from 'multer'
import env from '../../env'
import { getObjectFromS3, putObjectToS3 } from '../../utils/s3'

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
})

function requireBucket(): string {
  if (!env.S3_BUCKET) {
    throw new Error('S3_BUCKET is not configured')
  }
  return env.S3_BUCKET
}

function safePrefix(prefix: unknown): string {
  if (typeof prefix !== 'string') return ''
  const trimmed = prefix.trim().replace(/^\/+|\/+$/g, '')
  if (!trimmed) return ''
  return trimmed.split('/').filter(Boolean).join('/')
}

export async function uploadToS3Controller(req: Request, res: Response) {
  try {
    const bucket = requireBucket()
    const file = (req as Request & { file?: Express.Multer.File }).file
    if (!file) return res.status(400).json({ status: 'error', message: 'File is required (field name: file)' })

    const prefix = safePrefix(req.body?.prefix)
    const ext = (() => {
      const parts = file.originalname.split('.')
      if (parts.length <= 1) return ''
      const candidate = parts.pop() || ''
      return candidate && candidate.length <= 16 ? `.${candidate}` : ''
    })()

    const key = `${prefix ? `${prefix}/` : ''}${randomUUID()}${ext}`

    const result = await putObjectToS3({
      bucket,
      key,
      body: file.buffer,
      contentType: file.mimetype,
      originalName: file.originalname
    })

    return res.json({
      status: 'success',
      bucket,
      key,
      etag: result.ETag || undefined
    })
  } catch (error: any) {
    console.log('uploadToS3Controller error', error)
    return res.status(500).json({ status: 'error', message: error?.message || 'Internal server error' })
  }
}

export async function downloadFromS3Controller(req: Request, res: Response) {
  try {
    const bucket = requireBucket()
    const key = `${req.query.key || ''}`.trim()
    if (!key) return res.status(400).json({ status: 'error', message: 'Query param "key" is required' })

    const obj = await getObjectFromS3({ bucket, key })

    if (obj.ContentType) res.setHeader('Content-Type', obj.ContentType)
    if (obj.ContentLength != null) res.setHeader('Content-Length', `${obj.ContentLength}`)
    if (obj.ETag) res.setHeader('ETag', obj.ETag)
    if (obj.LastModified) res.setHeader('Last-Modified', obj.LastModified.toUTCString())

    const filename = `${req.query.filename || ''}`.trim()
    if (filename) {
      res.setHeader('Content-Disposition', `attachment; filename="${filename.split('"').join('')}"`)
    } else {
      res.setHeader('Content-Disposition', `attachment`)
    }

    // AWS SDK v3 returns a Node stream in Node runtimes
    const body: any = obj.Body
    if (!body || typeof body.pipe !== 'function') {
      return res.status(500).json({ status: 'error', message: 'Unexpected S3 response body' })
    }
    body.pipe(res)
  } catch (error: any) {
    const message = error?.name === 'NoSuchKey' ? 'File not found' : error?.message || 'Internal server error'
    const status = error?.name === 'NoSuchKey' ? 404 : 500
    return res.status(status).json({ status: 'error', message })
  }
}

