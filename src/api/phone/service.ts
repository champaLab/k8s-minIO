import promisePool from '../../utils/db'
import { PhoneModel } from './type'

export async function createPhoneService(data: PhoneModel, userId: number | null) {
  try {
    const sql = `INSERT INTO phone_numbers (phoneNumber, countryCode, normalizedNumber, status, prefix, phoneType, expireAt, updatedBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`
    const params = [data.phoneNumber, data.countryCode, data.normalizedNumber, data.status, data.prefix, data.phoneType, data.expireAt, userId]
    const [result]: any = await promisePool.query(sql, params)
    return result
  } catch (error) {
    throw error
  }
}

export async function getPhoneListService(data: { keyword?: string | null | undefined, status?: string, limit: number, offset: number }): Promise<{ rows: any[], total: number }> {
  try {
    let sql = `
      SELECT p.*, u.name as updatedByName 
      FROM phone_numbers p
      LEFT JOIN users u ON p.updatedBy = u.id
      WHERE p.deletedAt IS NULL`

    let countSql = `SELECT COUNT(*) as total FROM phone_numbers WHERE deletedAt IS NULL`
    const params: any[] = []

    if (data.keyword) {
      sql += ` AND p.phoneNumber LIKE ?`
      countSql += ` AND phoneNumber LIKE ?`
      params.push(`%${data.keyword}%`)
    }

    if (data.status) {
      sql += ` AND p.status = ?`
      countSql += ` AND status = ?`
      params.push(data.status)
    }

    const [countRows]: any[] = await promisePool.query(countSql, params)
    const total = countRows.length > 0 ? countRows[0].total : 0

    sql += ` ORDER BY status DESC LIMIT ? OFFSET ?`


    const queryParams = [...params, data.limit, data.offset]

    const [rows]: any = await promisePool.query(sql, queryParams)
    return { rows, total }
  } catch (error) {
    throw error
  }
}

export async function updatePhoneService(id: number, data: PhoneModel, userId: number | null) {
  try {
    const sql = `UPDATE phone_numbers SET phoneNumber=?, countryCode=?, normalizedNumber=?, status=?, prefix=?, phoneType=?, expireAt=?,updatedBy=?, updatedAt=NOW() WHERE id=?`
    const params = [data.phoneNumber, data.countryCode, data.normalizedNumber, data.status, data.prefix, data.phoneType, data.expireAt, userId, id]
    const [result]: any = await promisePool.query(sql, params)
    return result
  } catch (error) {
    throw error
  }
}

export async function deletePhoneService(id: number) {
  try {
    const sql = `UPDATE phone_numbers SET deletedAt=NOW() WHERE id=?`
    const params = [id]
    const [result]: any = await promisePool.query(sql, params)
    return result
  } catch (error) {
    throw error
  }
}
