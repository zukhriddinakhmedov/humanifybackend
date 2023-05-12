import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import sharp from 'sharp'
import { unlink } from 'fs/promises'

export class FavoriteController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals

        const favorite = await storage.favorites.find(req.query)
        res.status(200).json({
            success: true,
            data: {
                favorite
            },
            message: message('get_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const favorite = await storage.favorites.findOne({ user_id: id })

        res.status(200).json({
            success: true,
            data: {
                favorite
            },
            message: message('get_200', lang)
        })
    })

    createFavCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { title } = req.body
        const _id = req.params.id
        const favoriteToBeModified = await storage.favorites.findOne({ user_id: id })
        const categoryExists = favoriteToBeModified.body.findIndex(fav => fav.name.toLowerCase() === title.toLowerCase())
        if (favoriteToBeModified) {
            if (title && title.length > 0) {
                if (categoryExists === -1) {
                    let image
                    if (req.file) {
                        const photo = `favoriteImage/${req.file.fieldname}-${uuidv4()}.png`
                        await sharp(req.file.buffer).png().toFile(join(__dirname, '../../../uploads', photo))
                        image = photo
                    }
                    const newFavCategory = { name: title, list: [], image }
                    favoriteToBeModified.body.push(newFavCategory)
                    const favorite = await storage.favorites.update(favoriteToBeModified._id, favoriteToBeModified)
                    res.status(200).json({
                        success: true,
                        data: {
                            favorite
                        },
                        message: message('fav_updated_200', lang)
                    })
                } else {
                    return next(new AppError(400, 'duplicate_category_401'))
                }

            } else {
                return next(new AppError(400, 'no_title_401'))
            }
        } else {
            if (req.body.status) {
                return next(new AppError(403, 'auth_403'))
            }
        }
    })

    deleteFavCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { category_id } = req.body
        const favoriteToBeModified = await storage.favorites.findOne({ user_id: id })
        if (favoriteToBeModified) {
            const index = favoriteToBeModified.body.findIndex(
                (category: any) => category._id == category_id
            )
            if (index !== -1) {
                await unlink(join(__dirname, '../../../uploads', favoriteToBeModified.body[index].image))
                favoriteToBeModified.body.splice(index, 1)
                const favorite = await storage.favorites.update(favoriteToBeModified._id, favoriteToBeModified)

                res.status(200).json({
                    success: true,
                    data: {
                        favorite
                    },
                    message: message('fav_updated_200', lang)
                })
            }
        } else {
            if (req.body.status) {
                return next(new AppError(403, 'auth_403'))
            }
        }
    })

    addPostToFavCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { post_id } = req.body
        const category_id = req.params.category_id

        const favoriteToBeModified = await storage.favorites.findOne({ user_id: id })
        if (favoriteToBeModified) {
            const categoryIndex = favoriteToBeModified.body.findIndex(
                (category: any) => category._id == category_id
            )
            const index = favoriteToBeModified.body[categoryIndex].list.indexOf(post_id)
            if (index === -1) {
                if (post_id && post_id.length > 0) {
                    favoriteToBeModified.body[categoryIndex].list.push(post_id)
                    const favorite = await storage.favorites.update(favoriteToBeModified._id, favoriteToBeModified)
                    res.status(200).json({
                        success: true,
                        data: {
                            favorite
                        },
                        message: message('fav_post_added_200', lang)
                    })
                } else {
                    return next(new AppError(400, 'no_post_404'))
                }
            } else {
                res.status(200).json({
                    success: true,
                    message: message('post_already_in_the_list_400', lang)
                })
            }
        } else {
            if (req.body.status) {
                return next(new AppError(403, 'auth_403'))
            }
        }
    })

    deletePostFromFavCategory = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const { lang, id } = res.locals
            const { post_id } = req.body
            const category_id = req.params.category_id

            const favoriteToBeModified = await storage.favorites.findOne({ user_id: id })
            if (favoriteToBeModified) {
                const categoryIndex = favoriteToBeModified.body.findIndex(
                    (category: any) => category._id == category_id
                )
                const index = favoriteToBeModified.body[categoryIndex].list.indexOf(post_id)
                if (index !== -1) {
                    favoriteToBeModified.body[categoryIndex].list.splice(index, 1)
                    const favorite = await storage.favorites.update(favoriteToBeModified._id, favoriteToBeModified)
                    res.status(200).json({
                        success: true,
                        data: {
                            favorite
                        },
                        message: message('fav_post_deleted_200', lang)
                    })
                }
            } else {
                if (req.body.status) {
                    return next(new AppError(403, 'auth_403'))
                }
            }
        }
    )
}
