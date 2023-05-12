import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
export class ConversationValidator {
    private createSchema = Joi.object({
        receiver_id: Joi.string().required()
    })

    // private updateSchema = Joi.object({
    //     sender_id: Joi.string(),
    //     receiver_id: Joi.array().items(Joi.string()),
    //     body: Joi.string()
    // })

    create = catchAsync(async (new_message: any, next: NextFunction) => {
        const { error } = this.createSchema.validate(new_message)
        if (error) return next(error)

        next()
    })

    // update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //     const { error } = this.updateSchema.validate(req.body)
    //     if (error) return next(error)

    //     next()
    // })
}
