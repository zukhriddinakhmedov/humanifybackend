import { Router } from 'express'
import { PostController } from '../controllers/post'
import { PostValidator } from '../validators/post'
import { Middleware } from '../middleware/auth'
import multer from '../middleware/multer'
import { get, set, clear } from '../middleware/cache'

const router = Router({ mergeParams: true })
const controller = new PostController()
const validator = new PostValidator()
const middleware = new Middleware()
const upload = multer(['image/png', 'image/jpg', 'image/jpeg', 'video/mp4', 'video/mkv', 'video/webm'], 200).array('media', 10)

router
    .route('/create')
    .post(upload, middleware.auth(['user']), validator.create, controller.create, clear())
router
    .route('/like')
    .post(middleware.auth(['user']), validator.like, controller.like)
router
    .route('/create/comment')
    .post(middleware.auth(['user']), validator.comment, controller.comment)
router
    .route('/liked/comment')
    .post(middleware.auth(['user']), validator.likedComment, controller.likedComment)
router
    .route('/get/comment/:id')
    .get(middleware.auth(['user', 'admin']), controller.getComment)
router
    .route('/delete/comment')
    .delete(middleware.auth(['user', 'admin']), validator.likedComment, controller.deleteComment)
router
    .route('/all')
    .get(middleware.auth(['user']), get(), controller.getAll, set())
router
    .route('/find-with-category')
    .post(middleware.auth(['user']), get(), validator.getWithCategory, controller.getWithCategory, set())
router
    .route('/find-with-id')
    .post(middleware.auth(['user']), get(), validator.getWithCategory, controller.getWithId, set())
router
    .route('/alluser/:id')
    .get(middleware.auth(['user', 'admin']), get(), controller.getUserPosts, set())
router
    .route('/alladmin')
    .get(middleware.auth(['admin']), get(), controller.getAllAdmin, set())
router
    .route('/admin/:id')
    .get(middleware.auth(['admin']), controller.getOneAdmin)
router
    .route('/:id')
    .get(middleware.auth(['user']), get(), controller.getOne, set())
    .patch(middleware.auth(['user', 'admin']), validator.update, controller.update, clear())
    .delete(middleware.auth(['admin', 'user']), controller.delete, clear())

export default router