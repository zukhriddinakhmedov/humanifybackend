import { IFollows } from '../models/Follows';
import { INotification } from './../models/Notification';
import { IDeletedUser } from './../models/DeletedUser';
import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'
import { compare, hash, genSalt } from 'bcrypt'
import { signToken } from '../middleware/auth'
import sharp from 'sharp'
import { unlink } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import axios from 'axios'
import config from '../config/config'
import FormData from 'form-data'
import sgMail from '@sendgrid/mail'
const SENDGRID_API = config.SENDGRID_API
export class UserController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals,
            search = req.query.search as string
        delete req.query.search
        let filter = {}
        let user
        if (search) {
            filter = {
                ...filter,
                $or: [
                    {
                        'first_name': new RegExp(search, 'i')
                    },
                    {
                        'last_name': new RegExp(search, 'i')
                    },
                    {
                        'category': new RegExp(search, 'i')
                    },
                    {
                        'username': new RegExp(search, 'i')
                    }
                ]
            }
        } else if (req.query) {
            filter = req.query
        }
        if (role === 'user') {
            user = await storage.user.findSearch({ ...filter, status: 'active' })
        } else if (role === 'admin') {
            user = await storage.user.findSearch({ ...filter })
        }

        res.status(200).json({
            success: true,
            data: {
                user
            },
            message: message('get_200', lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const _id = req.params.id
        const oldFollow = await storage.follows.find({ user_id: _id, follower_id: id })
        let follow = 'unfollow'
        if (oldFollow.length) {
            follow = oldFollow[0].status
        }
        let user
        if (role === 'user') {
            user = await storage.user.findOne({ _id })
        } else if (role === 'admin') {
            user = await storage.user.findDelete({ _id })
        }
        res.status(200).json({
            success: true,
            data: {
                user,
                follow
            },
            message: message('get_200', lang)
        })
    })

    getFollowers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const _id = req.params.id


        let followers = await storage.follows.findPending({ user_id: _id, status: 'active' })
        for (let i = 0; i < followers.result.length; i++) {
            const followBack = await storage.follows.find({ user_id: followers.result[i].follower_id, follower_id: id })
            if (followBack.length) {
                followers.result[i].follow = followBack[0].status
            }
        }


        res.status(200).json({
            success: true,
            data: {
                followers
            },
            message: message('get_200', lang)
        })
    })

    getFollowings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const _id = req.params.id

        let followings
        if (_id === id) {
            followings = await storage.follows.findPending({ follower_id: id, status: 'active' })
            for (let i = 0; i < followings.result.length; i++) {
                followings.result[i].follow = 'active'
            }
        } else {
            followings = await storage.follows.findPending({ follower_id: _id, status: 'active' })
            for (let i = 0; i < followings.result.length; i++) {
                const followBack = await storage.follows.find({ user_id: followings.result[i].user_id, follower_id: id })
                if (followBack.length) {
                    followings.result[i].follow = followBack[0].status
                }
            }
        }

        res.status(200).json({
            success: true,
            data: {
                followings
            },
            message: message('get_200', lang)
        })
    })

    getPhone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const form_data = new FormData()
        const { phone, email, forgotPassword } = req.body
        let code = Math.floor(Math.random() * 1000000)
        if (code < 100000) {
            code = code + 100000
        }
        if (phone) {
            const users = await storage.user.find({ phone })
            if (users.length && !forgotPassword) {
                return next(new AppError(403, 'auth_403.2'))
            }
            form_data.append('mobile_phone', `${phone}`)
            form_data.append('message', `Your confirmation code: ${code}`)
            form_data.append('from', '4546')
            await axios({
                method: 'post',
                url: 'https://notify.eskiz.uz/api/message/sms/send',
                headers: {
                    Authorization: config.SmsToken,
                    ...form_data.getHeaders()
                },
                data: form_data
            })
            await storage.otp.create({ phone, code })
            res.status(201).json({
                success: true,
                message: message('sending_verification_code', lang)
            })
        } else if (email) {
            const users = await storage.user.find({ email })
            if (users.length && !forgotPassword) {
                return next(new AppError(403, 'auth_403.2'))
            }
            sgMail.setApiKey(SENDGRID_API)
            const msg = {
                to: email,// Change to your recipient
                from: 'handyappuz@gmail.com', // Change to your verified sender
                subject: 'Verification required',
                text: `Email check`,
                html: `<span><b style="color: black; ">Verification code:</b> ${code} <br>
            </span>`,
            }
            sgMail
                .send(msg)
                .then(async () => {
                    res.status(201).json({
                        success: true,
                        message: message('sending_verification_code', lang)
                    })
                    await storage.otp.create({ email, code })
                })
                .catch((error) => {
                    res.status(500).json({
                        status: 'false',
                        message: message('something_went_wrong!', lang)
                    })
                })
        }
    })

    checkOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const { code, phone, email } = req.body
        if (phone) {
            await storage.otp.findOne({ code, phone })
        } else {
            await storage.otp.findOne({ code, email })
        }

        res.status(201).json({
            success: true,
            message: message('otp_200', lang)
        })
    })

    checkUsername = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const { username } = req.body
        const users = await storage.user.find({ username })
        if (users.length) {
            res.status(201).json({
                success: false,
                message: message('username_exist', lang)
            })
        } else {
            res.status(201).json({
                success: true,
                message: message('otp_200', lang)
            })
        }

    })

    forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const { email, phone, new_password } = req.body
        let user
        if (email) {
            user = await storage.user.findOne({ email })
        } else if (phone) {
            user = await storage.user.findOne({ phone })
        } else {
            return next(new AppError(403, 'auth_403.2'))
        }
        const salt = await genSalt()
        const password = await hash(new_password, salt)
        await storage.user.update(user._id, { password })
        res.status(201).json({
            success: true,
            message: message('password_changed_200', lang)
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const { username, email, phone } = req.body
        if (username) {
            const user = await storage.user.find({ username })
            if (user.length) {
                return next(new AppError(403, 'auth_403.2'))
            }
        }
        if (email) {
            const user = await storage.user.find({ email })
            if (user.length) {
                return next(new AppError(403, 'auth_403.2'))
            }
        }
        if (phone) {
            const user = await storage.user.find({ phone })
            if (user.length) {
                return next(new AppError(403, 'auth_403.2'))
            }
        }
        const salt = await genSalt()
        req.body.password = await hash(req.body.password, salt)
        const user = await storage.user.create(req.body)
        const token = await signToken(user.id, 'user')
        await storage.favorites.create({ user_id: user._id })
        res.status(201).json({
            success: true,
            data: {
                user,
                token
            },
            message: message('user_created_200', lang)
        })
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const { lang } = res.locals
        const { username, password } = req.body
        let user
        const userUsername = await storage.user.findLogin({ username })
        const userEmail = await storage.user.findLogin({ email: username })
        if (parseInt(username)) {
            const userPhone = await storage.user.findLogin({ phone: parseInt(username) })
            user = userPhone[0]
        }
        if (userUsername.length) {
            user = userUsername[0]
        } else if (userEmail.length) {
            user = userEmail[0]
        }
        if ((!user) || (!(await compare(password, user.password)))) {
            return next(new AppError(401, 'auth_401.2'))
        }
        if (user.status !== "active") {
            return next(new AppError(401, 'auth_401.1'))
        }
        const token = await signToken(user.id, 'user')

        res.status(201).json({
            success: true,
            data: {
                user,
                token
            },
            message: message('user_logged_200', lang)
        })
    })
    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { old_password, new_password, status, account_type } = req.body
        const { lang, id, role } = res.locals
        const _id = req.params.id
        if (role === 'user' && ((id !== _id) || status || account_type)) {
            return next(new AppError(401, 'auth_403'))
        }
        const getUser = await storage.user.findDelete({ _id })
        if (role === 'user') {
            if (new_password && !old_password) {
                return next(new AppError(401, 'old_password_401'))
            } else if (new_password && old_password) {
                if (!(await compare(old_password, getUser.password))) {
                    return next(new AppError(401, 'auth_401'))
                }
                const salt = await genSalt()
                req.body.password = await hash(new_password, salt)
            }
        } else if (role === 'admin') {
            if (new_password) {
                const salt = await genSalt()
                req.body.password = await hash(new_password, salt)
            }
        }
        if (req.file) {
            const photo = `userAvatar/${req.file.fieldname}-${uuidv4()}.png`
            await sharp(req.file.buffer)
                .png()
                .toFile(join(__dirname, '../../../uploads', photo))
            if (getUser.avatar) {
                await unlink(join(__dirname, '../../../uploads', getUser.avatar))
            }
            req.body.avatar = photo
        }
        const user = await storage.user.update(_id, req.body)
        res.status(200).json({
            success: true,
            data: {
                user
            },
            message: message('user_updated_200', lang)
        })
    })

    makeInfluencer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        req.body.user_id = id
        await storage.makeInfluencer.create(req.body)
        res.status(201).json({
            success: true,
            message: message('otp_200', lang)
        })
    })

    follow = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { following } = req.body
        const toFollow = await storage.user.find({ _id: following })
        if (toFollow.length) {
            const oldFollow = await storage.follows.find({ user_id: following, follower_id: id })
            if (oldFollow.length) {
                await storage.follows.delete(oldFollow[0]._id)
                await storage.user.update(id, { $inc: { follows: -1 } })
                await storage.user.update(following, { $inc: { followers: -1 } })
            } else {
                if (toFollow[0].type === 'private') {
                    const obj = {
                        user_id: following,
                        status: 'pending',
                        follower_id: id
                    }
                    const obj2 = {
                        receiver_id: following,
                        type: 'waiting_follow',
                        follower_id: id
                    }
                    await storage.follows.create(obj as IFollows)
                    await storage.notification.create(obj2 as INotification)
                    await storage.user.update(following, { $inc: { notifications: +1 } })
                } else {
                    const obj = {
                        user_id: following,
                        status: 'active',
                        follower_id: id
                    }
                    const obj2 = {
                        receiver_id: following,
                        type: 'new_follow',
                        follower_id: id
                    }
                    await storage.notification.create(obj2 as INotification)
                    await storage.user.update(following, { $inc: { notifications: +1 } })
                    await storage.follows.create(obj as IFollows)
                    await storage.user.update(id, { $inc: { follows: +1 } })
                    await storage.user.update(following, { $inc: { followers: +1 } })
                }
            }
        }

        res.status(201).json({
            success: true,
            message: message('otp_200', lang)
        })
    })

    unfollow = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { following } = req.body

        const follower = await storage.user.find({ _id: following })
        if (follower.length) {
            const oldFollow = await storage.follows.findOne({ user_id: following, follower_id: id })
            await storage.follows.delete(oldFollow._id)
            await storage.user.update(following, { $inc: { follows: -1 } })
            await storage.user.update(id, { $inc: { followers: -1 } })
        }

        res.status(201).json({
            success: true,
            message: message('otp_200', lang)
        })
    })

    updatedPhone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id } = res.locals
        const { code, phone, email } = req.body
        await storage.user.findOne({ _id: id })
        let user
        if (phone) {
            await storage.otp.findOne({ code, phone })
            user = await storage.user.update(id, { phone })
        } else if (email) {
            await storage.otp.findOne({ code, email })
            user = await storage.user.update(id, { email })
        } else {
            return next(new AppError(403, 'auth_403.2'))
        }
        res.status(201).json({
            success: true,
            data: {
                user
            },
            message: message('otp_200', lang)
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, role, id } = res.locals
        const _id = req.params.id
        const { old_password } = req.body
        const user = await storage.user.findDelete({ _id });
        if (role === 'user' && (id !== _id || !old_password)) {
            return next(new AppError(401, 'auth_403'))
        } else if (old_password) {
            if (!(await compare(old_password, user.password))) {
                return next(new AppError(401, 'auth_401'))
            }
        } else if (role === 'admin') {
            await storage.admin.findOne({ _id: id })
        }
        await storage.post.updateMany({ owner_id: _id }, { status: 'inactive' })
        const obj = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            address: user.address,
            follows: user.follows,
            followers: user.followers,
            email: user.email,
            birthday: user.birthday,
            gender: user.gender,
            username: user.username,
            avatar: user.avatar
        }
        await storage.deletedUser.create(obj as IDeletedUser)
        await storage.user.delete(req.params.id)
        const favorite = await storage.favorites.findOne({ user_id: user._id })
        await storage.favorites.delete(favorite._id)
        res.status(200).json({
            success: true,
            message: message('user_delete_204', lang)
        })
    })
}
