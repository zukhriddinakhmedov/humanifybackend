import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'
import { compare, hash, genSalt } from 'bcrypt'
import { signToken } from '../middleware/auth'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import sharp from 'sharp'
import { unlink } from 'fs/promises'

export class ReportController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const { status, type, limit, page } = req.query
        const postLimit = Number(limit)
        let postPage = Number(page)
        postPage = postLimit * postPage
        let reports = await storage.report.findAll(status as string, type as string, postLimit, postPage)
        res.status(200).json({
            success: true,
            data: {
                reports
            },
            message: message('get_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        req.body.owner_id = id
        await storage.report.create(req.body)
        res.status(201).json({
            success: true,
            message: message('otp_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const _id = req.params.id
        const { status } = req.query
        await storage.report.updateMany({ receiver_id: _id }, { status: status })

        res.status(200).json({
            success: true,
            message: message('otp_200', lang)
        })
    })
    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const _id = req.params.id
        await storage.report.delete(_id)
        res.status(200).json({
            success: true,
            message: message('otp_200', lang)
        })
    })
}
