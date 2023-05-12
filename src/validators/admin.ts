import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
export class AdminValidator {
    pattern = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;'<>,.?/_₹]).{8,30}$/

    private createSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        login: Joi.string().required(),
        password: Joi.string().regex(this.pattern).required(),
    })

    private createInfluencerSchema = Joi.object({
        response: Joi.boolean().required(),
        user_id: Joi.string().required(),
        account_type: Joi.string().valid('user', 'professional', 'business').required()
    })

    private loginSchema = Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required()
    })

    private updateSchema = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string(),
        login: Joi.string(),
        old_password: Joi.string(),
        new_password: Joi.string().regex(this.pattern),
        status: Joi.string().valid('active', 'inactive')
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    createInfluencer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.createInfluencerSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}