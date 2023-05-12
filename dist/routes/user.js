"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const user_2 = require("../validators/user");
const otp_1 = require("../validators/otp");
const forgotPassword_1 = require("../validators/forgotPassword");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../middleware/multer"));
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new user_1.UserController();
const validator = new user_2.UserValidator();
const otpValidator = new otp_1.OTPValidator();
const forgotPasswordValidator = new forgotPassword_1.ForgotPasswordValidator();
const middleware = new auth_1.Middleware();
const upload = (0, multer_1.default)(['image/png', 'image/jpg', 'image/jpeg'], 20).single('avatar');
router
    .route('/phonecheck')
    .post(otpValidator.getPhone, controller.getPhone);
router
    .route('/otpcheck')
    .post(otpValidator.getCode, controller.checkOTP);
router
    .route('/usernamecheck')
    .post(otpValidator.getUsername, controller.checkUsername);
router
    .route('/forgotpassword')
    .post(forgotPasswordValidator.create, controller.forgotPassword);
router
    .route('/create')
    .post(validator.create, controller.create, (0, cache_1.clear)());
router
    .route('/login')
    .post(validator.login, controller.login);
router
    .route('/all')
    .get(middleware.auth(['user', 'admin']), (0, cache_1.get)(), controller.getAll, (0, cache_1.set)());
router
    .route('/updatephone')
    .patch(middleware.auth(['user']), otpValidator.getCode, controller.updatedPhone, (0, cache_1.clear)());
router
    .route('/makeinfluencer')
    .post(middleware.auth(['user']), validator.makeInfluencer, controller.makeInfluencer);
router
    .route('/getfollowers/:id')
    .get(middleware.auth(['user']), controller.getFollowers);
router
    .route('/getfollowings/:id')
    .get(middleware.auth(['user']), controller.getFollowings);
router
    .route('/:id')
    .get(middleware.auth(['user', 'admin']), controller.getOne)
    .patch(upload, middleware.auth(['user', 'admin']), validator.update, controller.update, (0, cache_1.clear)())
    .delete(middleware.auth(['user', 'admin']), controller.delete, (0, cache_1.clear)());
router
    .route('/follow')
    .post(middleware.auth(['user']), validator.follow, controller.follow);
router
    .route('/unfollow')
    .post(middleware.auth(['user']), validator.follow, controller.unfollow);
exports.default = router;
//# sourceMappingURL=user.js.map