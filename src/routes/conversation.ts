import { Router } from 'express'
import { ConversationController } from '../controllers/conversation'
import { ConversationValidator } from '../validators/conversation'
import { Middleware } from '../middleware/auth'
import multer from '../middleware/multer'
import { get, set, clear } from '../middleware/cache'

const router = Router({ mergeParams: true })
const controller = new ConversationController()
const validator = new ConversationValidator()
const middleware = new Middleware()

router
    .route('/all')
    .get(middleware.auth(['user']), get(), controller.getAll, set())
router
    .route('/create')
    .post(middleware.auth(['user']), validator.create, controller.create, clear())
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .delete(middleware.auth(['admin']), controller.delete, clear())

export default router