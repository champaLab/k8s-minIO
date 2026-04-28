import { NextFunction, Request, Response } from 'express'
import { tokenPayloadService } from '../api/auth/service'
import { Roles } from '../api/auth/types'

export function checkRole(roles: Roles[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const payload = tokenPayloadService(req)

    const userRole = payload.role
    console.log('userRole', userRole)

    if (roles.includes(userRole)) {
      return next()
    } else {
      return res.status(200).json({ status: 'error', message: "You don't have permission" })
    }
  }
}
