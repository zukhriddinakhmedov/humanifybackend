import express, { Router } from 'express'
import path from 'path'
import adminRouter from './admin'
import userRouter from './user'
import interestRouter from './interest'
import postRouter from './post'
import notificationRouter from './notification'
import favorite from './favorite'
import report from './report'
import deletedUser from './deletedUser'
import message from './message'
import conversation from './conversation'
import { Middleware } from '../middleware/auth'
const router = Router({ mergeParams: true })
const middleware = new Middleware()

router.use('/file', middleware.auth(['admin', 'user']), express.static(path.join(__dirname, '../../../uploads')))
router.use('/interestfile', express.static(path.join(__dirname, '../../../interests')))
router.use('/admin', adminRouter)
router.use('/users', userRouter)
router.use('/interests', interestRouter)
router.use('/posts', postRouter)
router.use('/notifications', notificationRouter)
router.use('/favorite', favorite)
router.use('/report', report)
router.use('/deleteduser', deletedUser)
router.use('/message', message)
router.use('/conversation', conversation)

export default router
