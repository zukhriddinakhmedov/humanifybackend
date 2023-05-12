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

export class InterestController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        let interests
        if (lang === 'uz') {
            interests = await storage.interestUZ.find(req.query)
        } else if (lang === 'ru') {
            interests = await storage.interestRU.find(req.query)
        }
        res.status(200).json({
            success: true,
            data: {
                interests
            },
            message: message('get_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const _id = req.params.id

        let interest
        if (lang === 'uz') {
            interest = await storage.interestUZ.findOne({ _id })
        } else if (lang === 'ru') {
            interest = await storage.interestRU.findOne({ _id })
        }

        res.status(200).json({
            success: true,
            data: {
                interest
            },
            message: message('get_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { titleRU, titleUZ } = req.body
        if (req.file) {
            const photo = `interestMedia/${req.file.fieldname}-${uuidv4()}.png`
            await sharp(req.file.buffer).png().toFile(join(__dirname, '../../../interests', photo))
            req.body.media = photo
        }
        const interestUZ = await storage.interestUZ.create({ title: titleUZ, media: req.body.media })
        await storage.interestRU.create({ title: titleRU, refId: interestUZ._id, media: req.body.media })
        await storage.interestUZ.update(interestUZ._id, { refId: interestUZ._id })
        res.status(201).json({
            success: true,
            message: message('interest_created_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id, lang } = res.locals
        const _id = req.params.id
        const interestUZ = await storage.interestUZ.findOne({ _id })
        const interestRU = await storage.interestRU.findOne({ refId: interestUZ._id })
        if (interestUZ.media) {
            await unlink(join(__dirname, '../../../interests', interestUZ.media))
        }
        await storage.interestUZ.delete({ _id })
        await storage.interestRU.delete({ _id: interestRU._id })
        res.status(200).json({
            success: true,
            message: message('interest_delete_200', lang)
        })
    })
}
