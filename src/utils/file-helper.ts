import multer, { diskStorage } from 'multer'
import dayjs from 'dayjs'
import { resolve } from 'path'
import env from '../env'
const date_dir = dayjs().format('YYYYMMDD')

export function setFileName(length: number = 25): string {
    let text = ''
    const possible = 'abcdefghijklmnopqrstuvwxyz012345678ASDFGHJKLZXCVBNMQWERTYUIOP'
    for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text
}

export const upload = (directory: string = '', separateByDate = false) =>
    multer({
        storage: diskStorage({
            destination: resolve(`${env.PWD}/uploads/${directory}`),
            filename: (_, file, cb) => {
                console.log('file upload', file)
                const ext = file.originalname.split('.').pop()
                console.log({ ext })
                // const ext = file.mimetype.split('/').pop()
                const fileName = date_dir + file.fieldname + setFileName() + `.${ext}`
                // const fileName = date_dir + file.fieldname + setFileName() + `.png`
                cb(null, `${fileName}`)
            }
        })
    })
