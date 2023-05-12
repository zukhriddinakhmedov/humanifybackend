import { NextFunction, query, Request, Response } from 'express'
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

export class DeletedUserController {
    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const _id = req.params.id
        let deletedUser = await storage.deletedUser.findOne({ _id })
        res.status(200).json({
            success: true,
            data: {
                deletedUser
            },
            message: message('get_200', lang)
        })
    })

    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        let deletedUsers = await storage.deletedUser.find(query)
        res.status(200).json({
            success: true,
            data: {
                deletedUsers
            },
            message: message('get_200', lang)
        })
    })
    // delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //     const { lang } = res.locals
    //     const _id = req.params.id
    //     await storage.deletedUser.delete(_id)
    //     res.status(200).json({
    //         success: true,
    //         message: message('otp_200', lang)
    //     })
    // })
}
