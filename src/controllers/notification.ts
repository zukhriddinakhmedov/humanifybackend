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

export class NotificationController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const notifications = await storage.notification.findAll(id)
        if (notifications.length) {
            // await storage.notification.delete(notifications[0].receiver_id)
            await storage.user.update(id, { notifications: 0 })
        }
        res.status(200).json({
            success: true,
            data: {
                notifications
            },
            message: message('get_200', lang)
        })
    })

    response = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const { follower_id, response } = req.body
        const request = await storage.follows.findOne({ user_id: id, follower_id, status: 'pending' })
        if (response) {
            const toFollow = await storage.user.find({ _id: follower_id })
            if (toFollow.length) {
                await storage.user.update(follower_id, { $inc: { follows: +1 } })
                await storage.user.update(id, { $inc: { followers: +1 } })
                await storage.follows.update(request._id, { status: 'active' })
            }
        } else {
            await storage.follows.delete(request._id)
        }

        res.status(200).json({
            success: true,
            message: message('otp_200', lang)
        })
    })

    getPendingRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const user = await storage.follows.findPending({ user_id: id, status: 'pending' })

        res.status(200).json({
            success: true,
            data: {
                user
            },
            message: message('otp_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const _id = req.params.id
        await storage.notification.delete(_id)
        res.status(200).json({
            success: true,
            message: message('otp_200', lang)
        })
    })
}
