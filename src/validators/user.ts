import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class UserValidator {
    passwordPattern = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;'<>,.?/_₹]).{8,30}$/
    usernamePattern = /^(?!.*\s)(?=.*[A-Z])|(?=.*[a-z]).{5,}$/
    private createSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email(),
        birthday: Joi.string().required(),
        interests: Joi.array().items(Joi.string()),
        username: Joi.string().regex(this.usernamePattern).required(),
        gender: Joi.string().valid('Male', 'Female').required(),
        phone: Joi.number(),
        password: Joi.string().regex(this.passwordPattern).required(),
        status: Joi.forbidden(),
        account_type: Joi.forbidden(),
        type: Joi.string().valid('private', 'public').required()
    })

    private loginSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })

    private followSchema = Joi.object({
        following: Joi.string().required()
    })

    private updateSchema = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
        email: Joi.forbidden(),
        birthday: Joi.forbidden(),
        address: {
            long: Joi.number().required(),
            lat: Joi.number().required(),
        },
        gender: Joi.forbidden(),
        username: Joi.string().regex(this.usernamePattern),
        bio: Joi.string(),
        category: Joi.string(),
        phone: Joi.forbidden(),
        old_password: Joi.string(),
        new_password: Joi.string().regex(this.passwordPattern),
        status: Joi.string().valid('active', 'inactive'),
        type: Joi.string().valid('private', 'public'),
        account_type: Joi.string().valid('user', 'business', 'professional'),
        interests: Joi.array().items(Joi.string())
    })

    private makeInfluencerSchema = Joi.object({
        description: Joi.string().required(),
        influencer_type: Joi.string().valid('business', 'professional').required()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    follow = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.followSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    makeInfluencer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.makeInfluencerSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}
