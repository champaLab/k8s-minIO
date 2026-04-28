import fs from 'fs-extra'
import path from 'path'
import logger from '../configs/winston'
import env from '../env'

export function encodeBase64(imageName: string, image: 'photo' | 'passport') {
  if (!imageName) return ''
  const subImageName = `${imageName}`.substring(0, 8)
  const ext = imageName.split(/\./g).pop()
  let imagePath = ''
  if (isNaN(Number(subImageName))) {
    imagePath = path.resolve(`${env.PWD}/uploaded/${image}/20190709/${imageName}`)
  } else {
    imagePath = path.resolve(`${env.PWD}/uploaded/${image}/${subImageName}/${imageName}`)
  }
  let bitmap = ''
  try {
    bitmap = fs.readFileSync(imagePath, 'base64')
  } catch (error: any) {
    logger.error(error['message'].split(/\,/).shift() || 'Not found file or directory', { error })
  }
  return `data:image/${ext};base64,${bitmap}`
}

export function isBase64Image(text: string) {
  const base64regex = /^data:image\/(png|jpg|jpeg|gif);base64,/
  if (!base64regex.test(text)) return false
  const imageData = text.replace(base64regex, '')
  try {
    const buffer = Buffer.from(imageData, 'base64')
    return buffer.toString('base64') === imageData && buffer.length > 0
  } catch (err) {
    return false
  }
}

export function isValidUrl(url: string) {
  try {
    const parsedUrl = new URL(url)
    return true
  } catch (err) {
    return false
  }
}
