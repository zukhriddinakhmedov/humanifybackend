import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'
import AppError from '../utils/appError'

export class MessageController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { receiver_id } = req.body
        const { limit, page } = req.query
        const postLimit = Number(limit)
        let postPage = Number(page)
        postPage = postLimit * postPage
        const messages = await storage.message.find(id, receiver_id, postLimit, postPage)
        res.status(200).json({
            success: true,
            data: {
                messages
            },
            message: message('get_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const _id = req.params.id

        const single_message = await storage.message.findOne({ _id })
        res.status(200).json({
            success: true,
            data: {
                single_message
            },
            message: message('get_200', lang)
        })
    })

    create = catchAsync(async (message: any, next: NextFunction) => {
        // const getUser = await storage.user.findOne({ _id: id })
        // req.body.owner_id = id
        const new_message = await storage.message.create(message)
        // getUser.messages.push(new_message._id)
        // await storage.user.update(id, { messages: getUser.messages })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const _id = req.params.id
        const message_to_update = await storage.message.findOne({ _id })
        if (message_to_update.sender_id !== id) {
            return next(new AppError(403, 'auth_403'))
        } else {
            const updated_message = await storage.message.update({ _id }, req.body)
            res.status(200).json({
                success: true,
                data: {
                    updated_message
                },
                message: message('message_updated_200', lang)
            })
        }
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id, lang } = res.locals
        const _id = req.params.id

        const message_to_update = await storage.message.findOne({ _id })
        if (message_to_update.sender_id !== id) {
            return next(new AppError(403, 'auth_403'))
        } else {
            await storage.message.delete({ _id })
            res.status(200).json({
                success: true,
                message: message('message_delete_200', lang)
            })
        }
    })
}
