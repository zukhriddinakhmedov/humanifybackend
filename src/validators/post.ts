import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
export class PostValidator {
    private createSchema = Joi.object({
        category: Joi.array().items(Joi.string()),
        body: Joi.string()
    })

    private likeSchema = Joi.object({
        target_id: Joi.string().required(),
    })

    private findWithCategory = Joi.object({
        search: Joi.array().items(Joi.string()).required()
    })

    private commentSchema = Joi.object({
        post_id: Joi.string().required(),
        reply_id: Joi.string(),
        body: Joi.string().required()
    })

    private likedCommentSchema = Joi.object({
        comment_id: Joi.string().required()
    })

    private updateSchema = Joi.object({
        category: Joi.array().items(Joi.string()),
        body: Joi.string(),
        status: Joi.string().valid('active', 'inactive'),
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (req.body.category) {
            req.body.category = JSON.parse(req.body.category)
        }
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    like = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.likeSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    comment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.commentSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    likedComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.likedCommentSchema.validate(req.body)
        if (error) return next(error)

        next()
    })

    getWithCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.findWithCategory.validate(req.body)
        if (error) return next(error)

        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}