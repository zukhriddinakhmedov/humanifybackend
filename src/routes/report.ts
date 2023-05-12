import { Router } from 'express'
import { ReportController } from '../controllers/report'
import { Middleware } from '../middleware/auth'
import { get, set, clear } from '../middleware/cache'
import { ReportValidator } from '../validators/report'

const router = Router({ mergeParams: true })
const controller = new ReportController()
const middleware = new Middleware()
const validator = new ReportValidator()

router
    .route('/create')
    .post(middleware.auth(['user']), validator.create, controller.create, clear())
router
    .route('/all')
    .get(middleware.auth(['admin']), get(), controller.getAll, set())
router
    .route('/:id')
    .patch(middleware.auth(['admin']), validator.update, controller.update, clear())
    .delete(middleware.auth(['admin']), controller.delete, clear())

// router
//     .route('/:category_id')
//     .patch(middleware.auth(['user']), controller.addPostToFavCategory, clear())
//     .delete(middleware.auth(['user']), controller.deletePostFromFavCategory, clear())

export default router
