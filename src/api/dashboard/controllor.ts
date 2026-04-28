import { getDashboardService } from "./service"
import { Request, Response } from "express"
export const getDashboardController = async (req: Request, res: Response) => {
    try {
        const dashboard = await getDashboardService()
        return res.status(200).json({ status: 'success', data: dashboard })
    } catch (error: any) {
        return res.status(500).json({ status: 'error', message: error.message })
    }
}