import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class OTPValidator {
    private getPhoneSchema = Joi.object({
        phone: Joi.number(),
        email: Joi.string().email(),
        forgotPassword: Joi.boolean()
    })

    private getCodeSchema = Joi.object({
        code: Joi.number().required(),
        phone: Joi.number(),
        email: Joi.string().email()
    })

    private getUsernameSchema = Joi.object({
        username: Joi.string().required()
    })

    getPhone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.getPhoneSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    getCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.getCodeSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    getUsername = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.getUsernameSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}
