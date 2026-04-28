import promisePool from '../../utils/db'
import { UserModel } from './types'
import dayjs from 'dayjs'

export async function findUserPartnerService(data: { keyword: string | null | undefined, partner_id?: string | null, role?: string, status?: string, page: number, limit: number }) {
  try {
    let sql = `
        SELECT id, name, telephone, status, role, createdAt FROM users
        WHERE 1=1`


    let countSql = `SELECT COUNT(*) as total FROM users WHERE 1=1`
    const params: any[] = []

    if (data.keyword) {
      sql += ` AND (telephone LIKE ? OR name LIKE ?)`
      countSql += ` AND (telephone LIKE ? OR name LIKE ?)`
      params.push(`%${data.keyword}%`, `%${data.keyword}%`)
    }

    if (data.role) {
      sql += ` AND role = ?`
      countSql += ` AND role = ?`
      params.push(data.role)
    }

    if (data.status) {
      sql += ` AND status = ?`
      countSql += ` AND status = ?`
      params.push(data.status)
    }

    const [countRows]: any = await promisePool.query(countSql, params)
    const total = Number(countRows[0]?.total || 0)

    const page = Number(data.page) || 1
    const limit = Number(data.limit) || 10
    const offset = (page - 1) * limit

    sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`
    
    const queryParams = [...params, limit, offset]

    const [rows]: any = await promisePool.query(sql, queryParams)
    
    const formattedRows = rows.map((row: any) => ({
      ...row,
      createdAt: row.createdAt ? dayjs(row.createdAt).format('M/D/YYYY, h:mm:ss A') : '-'
    }))

    return { 
      results: formattedRows, 
      total: total,
      pages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Error in findUserPartnerService:', error)
    throw error
  }
}





export async function createUserService(data: UserModel) {
  try {
    const sql = `INSERT users (name, telephone, password, status, role) VALUES (?, ?, ?, ?, ?)`
    const params = [data.name, data.telephone, data.password, data.status, data.role]
    const rows: any = await promisePool.query(sql, params)

    return rows
  } catch (error) {
    throw error
  }
}


export async function updateUserService(data: UserModel) {
  try {

    let sql = `UPDATE users SET name = ?, telephone = ?, status = ?, role = ? WHERE id = ?`
    let params = [data.name, data.telephone, data.status, data.role, data.id]

    if (data.password) {
      sql = `UPDATE users SET name = ?, telephone = ?, password = ?, status = ?, role = ? WHERE id = ?`
      params = [data.name, data.telephone, data.password, data.status, data.role, data.id]
    }

    const rows: any = await promisePool.query(sql, params)

    return rows
  } catch (error) {
    throw error
  }
}
