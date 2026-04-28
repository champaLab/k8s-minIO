import { Request } from 'express'
import logger from '../../configs/winston'
import promisePool from '../../utils/db'

import { AdminModel, PartnerApiKey, PartnerModel, TokenPayloadModel, UserPartnerModel } from './types'

export async function findPartnerService(data: { email: string }) {
  try {
    const sql = `SELECT password,partner_id,email,username FROM tbl_partner WHERE email = ?`
    const params = [data.email]
    const [rows]: any = await promisePool.query(sql, params)

    const wrappedRow: PartnerModel = Array.isArray(rows) ? rows[0] : rows
    return wrappedRow
  } catch (error) {
    logger.error(error)
    return null
  }
}

export async function findSessionPartnerService(data: { session_id: string | null | undefined; partner_id: string }) {
  const { session_id, partner_id } = data

  try {
    const sql = `SELECT password,partner_id,email,username FROM tbl_partner WHERE session_id = ? AND partner_id = ?`
    const params = [session_id, partner_id]
    const [rows]: any = await promisePool.query(sql, params)

    const wrappedRow: PartnerModel = Array.isArray(rows) ? rows[0] : rows
    return wrappedRow
  } catch (error) {
    logger.error(error)
    return null
  }
}

export async function findUserService(data: { telephone: string; }): Promise<UserPartnerModel | null> {
  try {
    const sql = `
        SELECT id,telephone,password,status,role,name
        FROM users
        WHERE telephone = ? LIMIT 1
    `
    const params = [data.telephone]
    const [rows]: any = await promisePool.query(sql, params)
    const wrappedRow = rows && rows.length > 0 ? rows[0] : null
    return wrappedRow
  } catch (error) {
    logger.error(error)
    return null
  }
}

export function isValidEmailService(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function tokenPayloadService(req: Request): TokenPayloadModel {
  // @ts-ignore
  const data = req.tokenPayload as TokenPayloadModel
  return data
}

export async function updatePasswordService(data: { telephone: string; password: string }) {
  try {
    const sql = `  UPDATE users SET password = ? WHERE telephone = ? `
    const params = [data.password, data.telephone]
    const rows: any = await promisePool.query(sql, params)
    return rows
  } catch (error) {
    throw error
  }
}