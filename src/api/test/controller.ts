import { Request, Response } from 'express'

// Kept for backwards compatibility (old test route removed from router).
export const uploadFileController = async (_req: Request, res: Response) => {
  return res.status(410).json({
    status: 'error',
    message: 'Deprecated. Use POST /files/upload instead.'
  })
}