import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class ReportValidator {
    private createSchema = Joi.object({
        receiver_id: Joi.string().required(),
        collection_type: Joi.string().valid('users', 'posts', 'comments').required(),
        report_type: Joi.string().required()
    })

    private updateSchema = Joi.object({
        status: Joi.string().valid('active', 'inprogress', 'reviewed').required()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

}
