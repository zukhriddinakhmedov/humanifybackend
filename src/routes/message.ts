import { Router } from 'express'
import { MessageController } from '../controllers/message'
import { MessageValidator } from '../validators/message'
import { Middleware } from '../middleware/auth'
import multer from '../middleware/multer'
import { get, set, clear } from '../middleware/cache'

const router = Router({ mergeParams: true })
const controller = new MessageController()
const validator = new MessageValidator()
const middleware = new Middleware()
const upload = multer(
    ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4', 'video/mkv', 'video/webm'],
    20
).array('media', 10)

router
    .route('/create')
    .post(upload, middleware.auth(['user']), validator.create, controller.create, clear())
router
    .route('/all')
    .post(middleware.auth(['user']), get(), controller.getAll, set())
router
    .route('/:id')
    .get(middleware.auth(['user']), controller.getOne)
    .patch(middleware.auth(['user', 'admin']), validator.update, controller.update, clear())
    .delete(middleware.auth(['admin', 'user']), controller.delete, clear())

export default router
