import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import env from '../env'

export const s3 = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT || undefined,
  forcePathStyle: env.S3_FORCE_PATH_STYLE,
  credentials:
    env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
      ? { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY }
      : undefined
})

function toHeaderSafeMetadataValue(value: string): string {
  // S3 Metadata is sent as HTTP headers (x-amz-meta-*), which must not contain control chars
  // and must be representable in a header-safe ASCII form for Node's HTTP client.
  const noCtl = value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim()
  // Encode to ASCII while keeping it reversible.
  return encodeURIComponent(noCtl)
}

export async function putObjectToS3(input: {
  bucket: string
  key: string
  body: Buffer
  contentType?: string
  originalName?: string
}) {
  const metadata = input.originalName
    ? {
        originalname: toHeaderSafeMetadataValue(input.originalName),
        originalname_encoding: 'encodeURIComponent'
      }
    : undefined

  return s3.send(
    new PutObjectCommand({
      Bucket: input.bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      Metadata: metadata
    })
  )
}

export async function getObjectFromS3(input: { bucket: string; key: string }) {
  return s3.send(
    new GetObjectCommand({
      Bucket: input.bucket,
      Key: input.key
    })
  )
}

