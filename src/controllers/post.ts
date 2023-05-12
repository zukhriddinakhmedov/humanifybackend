import { INotification } from './../models/Notification';
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
import fs from 'fs'
import { IDeletedPost } from './../models/DeletedPost';
export class PostController {
    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const _id = req.params.id
        const post = await storage.post.findOneUser(_id)

        res.status(200).json({
            success: true,
            data: {
                post
            },
            message: message('get_200', lang)
        })
    })

    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { limit, page } = req.query
        const postLimit = Number(limit)
        let postPage = Number(page)
        postPage = postLimit * postPage
        const post = await storage.post.findLike(id, postLimit, postPage)

        res.status(200).json({
            success: true,
            data: {
                post
            },
            message: message('get_200', lang)
        })
    })

    getWithCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { search } = req.body
        const { limit, page } = req.query
        const postLimit = Number(limit)
        let postPage = Number(page)
        postPage = postLimit * postPage
        const post = await storage.post.findWithCategory(id, postLimit, postPage, search)

        res.status(200).json({
            success: true,
            data: {
                post
            },
            message: message('get_200', lang)
        })
    })

    getWithId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { search } = req.body
        const { limit, page } = req.query
        const postLimit = Number(limit)
        let postPage = Number(page)
        postPage = postLimit * postPage
        const post = await storage.post.findWithId(id, postLimit, postPage, search)

        res.status(200).json({
            success: true,
            data: {
                post
            },
            message: message('get_200', lang)
        })
    })

    getUserPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const { limit, page } = req.query
        const user_id = req.params.id
        const postLimit = Number(limit)
        let postPage = Number(page)
        postPage = postLimit * postPage
        let post
        if (user_id !== id) {
            post = await storage.post.findUserPosts(id, postLimit, postPage, user_id)
        } else if (user_id === id || role === 'admin') {
            post = await storage.post.findOwnPosts(postLimit, postPage)
        }
        res.status(200).json({
            success: true,
            data: {
                post
            },
            message: message('get_200', lang)
        })
    })

    getAllAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const { limit, page, search } = req.query
        const postLimit = Number(limit)
        let postPage = Number(page)
        postPage = postLimit * postPage
        const post = await storage.post.findAdminUser(postLimit, postPage, search as string)

        res.status(200).json({
            success: true,
            data: {
                post
            },
            message: message('get_200', lang)
        })
    })

    getOneAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const _id = req.params.id
        const post = await storage.post.findOne({ _id })

        res.status(200).json({
            success: true,
            data: {
                post
            },
            message: message('get_200', lang)
        })
    })

    like = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { target_id } = req.body

        const post = await storage.post.findOneLike({ _id: target_id, status: 'active' })
        if (post.likes.includes(id)) {
            post.likes.splice(post.likes.indexOf(id), 1)
            await storage.post.update({ _id: target_id }, { likes: post.likes })
        } else {
            await storage.post.update({ _id: target_id }, { $push: { likes: id } });
            if (post.owner_id !== id) {
                const obj2 = {
                    receiver_id: post.owner_id,
                    post_id: post._id,
                    type: 'like',
                    follower_id: id
                }
                await storage.notification.create(obj2 as INotification)
                await storage.user.update(post.owner_id, { $inc: { notifications: +1 } })
            }
        }

        res.status(200).json({
            success: true,
            message: message('otp_200', lang)
        })
    })

    comment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { post_id } = req.body
        const post = await storage.post.findOneLike({ _id: post_id, status: 'active' })
        req.body.owner_id = id
        const comments = await storage.comment.create(req.body)
        if (post.owner_id !== id) {
            const obj2 = {
                receiver_id: post.owner_id,
                post_id: post._id,
                type: 'comment',
                follower_id: id
            }
            await storage.notification.create(obj2 as INotification)
            await storage.user.update(post.owner_id, { $inc: { notifications: +1 } })
        }
        await storage.post.update(post_id, { $inc: { comments: +1 } })
        res.status(200).json({
            success: true,
            data: {
                comments
            },
            message: message('otp_200', lang)
        })
    })

    likedComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { comment_id } = req.body
        const comment = await storage.comment.findOne({ _id: comment_id })
        if (comment.likes.includes(id)) {
            comment.likes.splice(comment.likes.indexOf(id), 1)
            await storage.comment.update({ _id: comment_id }, { likes: comment.likes })
        } else {
            await storage.comment.update({ _id: comment_id }, { $push: { likes: id } });
        }

        res.status(200).json({
            success: true,
            message: message('otp_200', lang)
        })
    })

    getComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const _id = req.params.id
        const { limit, page } = req.query
        const postLimit = Number(limit)
        let postPage = Number(page)
        postPage = postLimit * postPage
        const comments = await storage.post.findComment(_id, postLimit, postPage, id)
        res.status(200).json({
            success: true,
            data: {
                comments
            },
            message: message('get_200', lang)
        })
    })

    deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const { comment_id } = req.body
        const comment = await storage.comment.findOne({ _id: comment_id })
        if (comment.owner_id !== id && role !== 'admin') {
            return next(new AppError(401, 'auth_403'))
        }
        await storage.comment.delete(comment_id)
        await storage.post.update(comment.post_id, { $inc: { comments: -1 } })
        res.status(200).json({
            success: true,
            message: message('otp_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals

        const user = await storage.user.findOne({ _id: id })
        req.body.owner_type = user.account_type
        req.body.owner_id = id
        const media: { url: string, type: string }[] = []
        if (req.files) {
            const url = req.files as Array<Express.Multer.File>
            for (let i = 0; i < url.length; i++) {
                const fileName = `${url[i].fieldname}-${uuidv4()}.${url[i].mimetype.split('/')[1]}`
                await fs.promises.writeFile(join(__dirname, '../../../uploads/postMedia', fileName), url[i].buffer)
                const obj = {
                    url: fileName,
                    type: url[i].mimetype.split('/')[0]
                }
                media.push(obj)
            }
            req.body.media = media
        }
        const post = await storage.post.create(req.body)
        await storage.user.update(id, { $inc: { posts: +1 } })
        res.status(201).json({
            success: true,
            data: {
                post
            },
            message: message('post_created_200', lang)
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const _id = req.params.id

        if (role === 'user') {
            if (req.body.status) {
                return next(new AppError(403, 'auth_403'))
            }
            await storage.post.findOne({ _id, owner_id: id })
        }
        const post = await storage.post.update({ _id }, req.body)

        res.status(200).json({
            success: true,
            data: {
                post
            },
            message: message('post_updated_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id, lang, role } = res.locals
        const _id = req.params.id
        let post
        let user
        if (role === 'user') {
            user = await storage.user.findOne({ _id: id })
            post = await storage.post.findOne({ _id, owner_id: id })
        } else {
            post = await storage.post.findOne({ _id })
            user = await storage.user.findOne({ _id: post.owner_id })
        }
        const obj = {
            _id: post._id,
            owner_id: post.owner_id,
            category: post.category,
            body: post.body,
            media: post.media,
            likes: post.likes,
            comments: post.comments,
            views: post.views
        }
        await storage.deletedPost.create(obj as IDeletedPost)
        await storage.post.delete({ _id })
        await storage.user.update(user._id, { $inc: { posts: -1 } })
        res.status(200).json({
            success: true,
            message: message('post_deleted_200', lang)
        })
    })
}
