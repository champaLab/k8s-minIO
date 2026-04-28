import { NextFunction, Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayloadModel } from '../api/auth/types'
import env from '../env'
import { logNamespace } from './logger-middleware'

const i = 'MAS System Ltd' // Issuer (Software organization who issues the token)
const s = 'mas@domain.com' // Subject (intended user of the token)
const a = 'https://www.mas.la' // Audience (Domain within which this token will live and function)

const option: SignOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: '8h',
  algorithm: 'RS256'
}

export const sign = (payload: TokenPayloadModel) => {
  const privateKEY = env.PRIVATE_KEY
  return jwt.sign(payload, privateKEY, option)
}

export const verify = async (req: Request, res: Response, next: NextFunction) => {

  let token = req.headers['x-access-token'] as string
  if (req.headers.authorization) {
    token = `${req.headers.authorization}`.replace('Bearer ', '')
  }
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' })

  const publicKEY = env.PUBLIC_KEY

  jwt.verify(token, publicKEY, {
    issuer: i,
    subject: s,
    audience: a,
    maxAge: '8h',
    algorithms: ['RS256']
  }, (err, decoded: any) => {
    if (err) {
      console.error(err)
      return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' })
    }
    if (decoded) {
      logNamespace.run(() => {
        if (decoded['telephone']) logNamespace.set('telephone', decoded['telephone'])
        if (decoded['id']) logNamespace.set('id', decoded['id'])
        if (decoded['role']) logNamespace.set('role', decoded['role'])
      })

      // @ts-ignore
      req.tokenPayload = decoded
    }
    next()
  })
}
