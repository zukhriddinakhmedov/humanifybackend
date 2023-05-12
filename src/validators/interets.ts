import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class InterestValidator {
    private createSchema = Joi.object({
        titleUZ: Joi.string().required(),
        titleRU: Joi.string().required()
    })

    private updateSchema = Joi.object({
        titleUZ: Joi.string().required(),
        titleRU: Joi.string().required()
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
