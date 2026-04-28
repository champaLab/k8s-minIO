import { Request, Response } from 'express'
import { createPhoneService, getPhoneListService, updatePhoneService, deletePhoneService } from './service'
import { tokenPayloadService } from '../auth/service'

export const createPhoneController = async (req: Request, res: Response) => {
  try {
    const payloadToken = tokenPayloadService(req)
    const createdBy = payloadToken?.id ?? null

    // Trim string values
    const data = { ...req.body }
    if (data.phoneNumber) data.phoneNumber = `${data.phoneNumber}`.trim()
    if (data.countryCode) data.countryCode = `${data.countryCode}`.trim()
    if (data.normalizedNumber) data.normalizedNumber = `${data.normalizedNumber}`.trim()
    if (data.prefix) data.prefix = `${data.prefix}`.trim()

    await createPhoneService(data, createdBy);
    res.json({ status: 'success', message: 'Create phone number success' })
  } catch (error: any) {
    console.error('[createPhoneController] Error:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ status: 'error', message: 'This phone number already exists in the system' })
    }
    res.json({ status: 'error', message: 'Internal server error' })
  }
}

export const getPhoneListController = async (req: Request, res: Response) => {
  try {
    const keyword = req.body.keyword ? `${req.body.keyword}`.trim() : null
    const status = req.body.status
    const page = Number(req.body.page) || 1

    const limit = Number(req.body.limit) || 2
    const offset = (page - 1) * limit


    const result = await getPhoneListService({ keyword, status, limit, offset })
    const listPhone: any[] = []

    for (const [index, item] of result.rows.entries()) {
      listPhone.push({
        indexNo: index + 1 + offset,
        ...item
      })
    }

    res.json({
      status: 'success', message: 'Get phone numbers success',
      data: listPhone,
      pagination: {
        total: Math.ceil(result.total / limit),
        page,
        limit
      }
    })
  } catch (error) {
    res.json({ status: 'error', message: 'Internal server error' })
  }
}

export const updatePhoneController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.body.id)
    if (!id) return res.json({ status: 'error', message: 'Missing ID' })

    const payloadToken = tokenPayloadService(req)
    const updatedBy = payloadToken?.id ?? null

    // Trim string values
    const data = { ...req.body }
    if (data.phoneNumber) data.phoneNumber = `${data.phoneNumber}`.trim()
    if (data.countryCode) data.countryCode = `${data.countryCode}`.trim()
    if (data.normalizedNumber) data.normalizedNumber = `${data.normalizedNumber}`.trim()
    if (data.prefix) data.prefix = `${data.prefix}`.trim()

    await updatePhoneService(id, data, updatedBy)
    res.json({ status: 'success', message: 'Update phone number success' })
  } catch (error: any) {
    console.error('[updatePhoneController] Error:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ status: 'error', message: 'This phone number already exists in the system' })
    }
    res.json({ status: 'error', message: 'Internal server error' })
  }
}

export const deletePhoneController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.body.id)
    if (!id) return res.json({ status: 'error', message: 'Missing ID' })

    await deletePhoneService(id)
    res.json({ status: 'success', message: 'Delete phone number success' })
  } catch (error) {
    res.json({ status: 'error', message: 'Internal server error' })
  }
}
