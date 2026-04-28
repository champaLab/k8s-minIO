import { Request, Response } from 'express'
import { sign, } from '../../utils/jwt'
import { findUserService, findPartnerService, findSessionPartnerService, tokenPayloadService, updatePasswordService } from './service'
import { Roles, TokenPayloadModel } from './types'
import bcrypt from "bcryptjs";
import { env } from 'process';

export const loginController = async (req: Request, res: Response) => {
  try {
    const telephone = `${req.body.telephone}`.trim()
    const password = req.body.password

    if (env.NODE_ENV === 'development') {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      console.log({ hash })
    }

    const user = await findUserService({ telephone, })
    console.log(user)

    if (!user) {
      return res.json({ status: 'error', message: 'Telephone or password invalid' })
    } else if (user && user.status.toUpperCase() !== 'ACTIVE') {
      return res.json({ status: 'error', message: 'Your account is not allowed' })
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.json({ status: 'error', message: 'Telephone or password invalid' })
    }


    const payload: TokenPayloadModel = {
      id: user.id,
      telephone: user.telephone,
      role: user.role.toUpperCase() as Roles,
      name: user.name
    }

    const token = sign(payload)
    if (!token) return res.json({ status: 'error', message: 'Login failed!' })

    return res.json({
      status: 'success',
      message: 'Login success',
      data: {
        token,
        ...payload
      }
    })
  } catch (error) {
    return res.json({
      status: 'error',
      message: 'Login failed',
    })
  }
}

export const accessTokenForPartnerController = async (req: Request, res: Response) => {
  try {
    const payloadToken = tokenPayloadService(req)

    const payload: TokenPayloadModel = {
      id: payloadToken.id,
      telephone: payloadToken.telephone,
      role: payloadToken.role,
      name: payloadToken.name
    }

    return res.json({
      status: 'success',
      message: 'Verify token success',
      data: {
        token: '',
        isLogin: true,
        ...payload
      }
    })
  } catch (error) {
    return res.json({
      status: 'error',
      message: 'Verify token failed',
    })
  }
}

export const updatePasswordController = async (req: Request, res: Response) => {
  try {
    const telephone = tokenPayloadService(req).telephone
    const password = req.body.new_password
    const confirm_password = req.body.confirm_password
    const current_password = req.body.current_password

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (password !== confirm_password) {
      return res.json({ status: 'error', message: 'New password and confirm password do not match' })
    }

    const user = await findUserService({ telephone, })
    if (!user) {
      return res.json({ status: 'error', message: 'User not found' })
    }

    const isMatch = bcrypt.compareSync(current_password, user.password);
    if (!isMatch) {
      return res.json({ status: 'error', message: 'Current password is incorrect' })
    }

    await updatePasswordService({ telephone, password: hash })

    return res.json({
      status: 'success',
      message: 'Update password success',
    })
  } catch (error) {
    return res.json({
      status: 'error',
      message: 'Update password failed',
    })
  }
}