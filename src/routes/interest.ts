import { Router } from 'express'
import { InterestController } from '../controllers/interest'
import { InterestValidator } from '../validators/interets'
import { Middleware } from '../middleware/auth'
import { get, set, clear } from '../middleware/cache'
import multer from '../middleware/multer'

const router = Router({ mergeParams: true })
const controller = new InterestController()
const validator = new InterestValidator()
const middleware = new Middleware()
const upload = multer(['image/png', 'image/jpg', 'image/jpeg'], 20).single('media')

router
    .route('/all')
    .get(get(), controller.getAll, set())
router
    .route('/create')
    .post(upload, middleware.auth(['admin']), validator.create, controller.create, clear())
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .delete(middleware.auth(['admin']), controller.delete, clear())

export default router