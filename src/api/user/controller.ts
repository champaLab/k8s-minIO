import { Request, Response } from 'express'
import bcrypt from "bcryptjs";
import { findUserService, tokenPayloadService } from '../auth/service';
import { createUserService, findUserPartnerService, updateUserService } from './service';

export const getUserController = async (req: Request, res: Response) => {
  try {
    const keyword = req.body.keyword ? `${req.body.keyword}`.trim() : null
    const role = req.body.role
    const status = req.body.status

    const page = Number(req.body.page) || 1
    const limit = Number(req.body.limit) || 10

    const result = await findUserPartnerService({ keyword, role, status, page, limit })
    res.json({ 
      status: 'success', 
      message: 'Get user success', 
      data: {
        results: result.results,
        total: result.total,
        pages: result.pages
      }, 
      page, 
      limit 
    })

  } catch (error) {
    console.error('Error in getUserController:', error)
    res.json({ status: 'error', message: 'Internal server error' })
  }
}

export const createUserController = async (req: Request, res: Response) => {

  try {
    const name = req.body.name
    const telephone = `${req.body.telephone}`.trim()
    const password = req.body.password
    const status = req.body.status
    const role = req.body.role
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user: any = await findUserService({ telephone, })
    if (user) {
      return res.json({ status: 'error', message: 'telephone already exists' })
    }
    await createUserService({
      name,
      telephone,
      password: hash,
      status,
      role,
    })

    res.json({ status: 'success', message: 'Create user success' })
  } catch (error) {
    res.json({ status: 'error', message: 'Internal server error' })
  }
}


export const updateUserController = async (req: Request, res: Response) => {

  try {
    const name = req.body.name
    const telephone = `${req.body.telephone}`.trim()
    const password = req.body.password
    const status = req.body.status
    const role = req.body.role
    // let partner_id = req.body.partner_id
    const id = req.params.id || req.body.id
    let hash: string | null = null
    if (password && password.length >= 6) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    } else if (password && password.length > 0) {
      return res.json({ status: 'error', message: 'Password must be at least 6 characters long' })
    }


    const user: any = await findUserService({ telephone, })
    if (user && user.id !== Number(id)) {
      return res.json({ status: 'error', message: 'Telephone already exists' })
    }



    await updateUserService({
      id,
      name,
      telephone,
      password: hash,
      status,
      role,
    })

    res.json({ status: 'success', message: 'Update user success' })
  } catch (error) {
    res.json({ status: 'error', message: 'Internal server error' })
  }
}
