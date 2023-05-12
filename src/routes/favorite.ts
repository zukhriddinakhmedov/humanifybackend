import { Router } from 'express'
import { FavoriteController } from '../controllers/favorite'
import { Middleware } from '../middleware/auth'
import { get, set, clear } from '../middleware/cache'
import multer from '../middleware/multer'

const router = Router({ mergeParams: true })
const controller = new FavoriteController()
const middleware = new Middleware()
const upload = multer(['image/png', 'image/jpg', 'image/jpeg'], 20).single('image')

router
    .route('/all')
    .get(middleware.auth(['admin']), get(), controller.getAll, set())
router
    .route('/')
    .get(middleware.auth(['user']), controller.getOne)
    .patch(upload, middleware.auth(['user']), controller.createFavCategory, clear())
    .delete(middleware.auth(['user']), controller.deleteFavCategory, clear())

router
    .route('/:category_id')
    .patch(middleware.auth(['user']), controller.addPostToFavCategory, clear())
    .delete(middleware.auth(['user']), controller.deletePostFromFavCategory, clear())

export default router
