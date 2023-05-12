import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'
import AppError from '../utils/appError'

export class ConversationController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { limit, page } = req.query
        const postLimit = Number(limit)
        let postPage = Number(page)
        postPage = postLimit * postPage
        const conversations = await storage.conversation.findAll(id, postLimit, postPage)
        res.status(200).json({
            success: true,
            data: {
                conversations
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

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { receiver_id } = req.body

        const senderConversation = await storage.conversation.findOne({ sender_id: id, receiver_id })
        const receiverConversation = await storage.conversation.findOne({ sender_id: receiver_id, receiver_id: id })
        if (!senderConversation) {
            await storage.conversation.create({ sender_id: id, receiver_id })
        }
        if (!receiverConversation) {
            await storage.conversation.create({ sender_id: receiver_id, receiver_id: id })
        }
        res.status(200).json({
            success: true,
            message: message('otp_200', lang)
        })
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
