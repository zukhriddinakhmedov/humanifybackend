import { Router } from 'express'
import { DeletedUserController } from '../controllers/deletedUser'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new DeletedUserController()
const middleware = new Middleware()

router
    .route('/all')
    .get(middleware.auth(['admin']), controller.getAll)

router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
// .delete(middleware.auth(['admin']), controller.delete)

export default router
