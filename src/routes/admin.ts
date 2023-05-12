import { Router } from 'express'
import { AdminController } from '../controllers/admin'
import { AdminValidator } from '../validators/admin'
import { Middleware } from '../middleware/auth'
import multer from '../middleware/multer'
import { get, set, clear } from '../middleware/cache'

const router = Router({ mergeParams: true })
const controller = new AdminController()
const validator = new AdminValidator()
const middleware = new Middleware()
const upload = multer(['image/png', 'image/jpg', 'image/jpeg'], 20).single('avatar')

router
    .route('/create/superadmin')
    .post(validator.create, controller.createSuperAdmin, clear())
router
    .route('/create/influencer')
    .post(middleware.auth(['admin']), validator.createInfluencer, controller.createInfluencer)
router
    .route('/all')
    .get(middleware.auth(['admin']), get(), controller.getAll, set())
router
    .route('/create')
    .post(middleware.auth(['admin']), validator.create, controller.create, clear())
router
    .route('/makeinfluensers')
    .get(middleware.auth(['admin']), controller.getAllMakeInfluencers)
router
    .route('/login')
    .post(validator.login, controller.login)
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .patch(upload, middleware.auth(['admin']), validator.update, controller.update, clear())
    .delete(middleware.auth(['admin']), controller.delete, clear())

export default router