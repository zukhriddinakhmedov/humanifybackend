import { Router } from 'express'
import { NotificationController } from '../controllers/notification'
import { Middleware } from '../middleware/auth'
import { ResponseValidator } from '../validators/response'

const router = Router({ mergeParams: true })
const validator = new ResponseValidator()
const controller = new NotificationController()
const middleware = new Middleware()

router.route('/all').get(middleware.auth(['user']), controller.getAll)
router.route('/response').post(middleware.auth(['user']), validator.create, controller.response)
router.route('/pendingrequests').get(middleware.auth(['user']), controller.getPendingRequests)
router
    .route('/:id')
    .delete(middleware.auth(['user']), controller.delete)
//     .patch(middleware.auth(['influencer']), controller.update)
//     .delete(middleware.auth(['influencer']), controller.delete)

export default router

