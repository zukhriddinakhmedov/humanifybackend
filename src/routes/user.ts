import { Router } from 'express'
import { UserController } from '../controllers/user'
import { UserValidator } from '../validators/user'
import { OTPValidator } from '../validators/otp'
import { ForgotPasswordValidator } from '../validators/forgotPassword'
import { Middleware } from '../middleware/auth'
import multer from '../middleware/multer'
import { get, set, clear } from '../middleware/cache'

const router = Router({ mergeParams: true })
const controller = new UserController()
const validator = new UserValidator()
const otpValidator = new OTPValidator()
const forgotPasswordValidator = new ForgotPasswordValidator()
const middleware = new Middleware()
const upload = multer(['image/png', 'image/jpg', 'image/jpeg'], 20).single('avatar')
router
    .route('/phonecheck')
    .post(otpValidator.getPhone, controller.getPhone)
router
    .route('/otpcheck')
    .post(otpValidator.getCode, controller.checkOTP)
router
    .route('/usernamecheck')
    .post(otpValidator.getUsername, controller.checkUsername)
router
    .route('/forgotpassword')
    .post(forgotPasswordValidator.create, controller.forgotPassword)
router
    .route('/create')
    .post(validator.create, controller.create, clear())
router
    .route('/login')
    .post(validator.login, controller.login)
router
    .route('/all')
    .get(middleware.auth(['user', 'admin']), get(), controller.getAll, set())
router
    .route('/updatephone')
    .patch(middleware.auth(['user']), otpValidator.getCode, controller.updatedPhone, clear())
router
    .route('/makeinfluencer')
    .post(middleware.auth(['user']), validator.makeInfluencer, controller.makeInfluencer)
router
    .route('/getfollowers/:id')
    .get(middleware.auth(['user']), controller.getFollowers)
router
    .route('/getfollowings/:id')
    .get(middleware.auth(['user']), controller.getFollowings)
router
    .route('/:id')
    .get(middleware.auth(['user', 'admin']), controller.getOne)
    .patch(upload, middleware.auth(['user', 'admin']), validator.update, controller.update, clear())
    .delete(middleware.auth(['user', 'admin']), controller.delete, clear())
router
    .route('/follow')
    .post(middleware.auth(['user']), validator.follow, controller.follow)
router
    .route('/unfollow')
    .post(middleware.auth(['user']), validator.follow, controller.unfollow)

export default router
