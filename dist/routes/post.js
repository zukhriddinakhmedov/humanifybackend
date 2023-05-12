"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = require("../controllers/post");
const post_2 = require("../validators/post");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../middleware/multer"));
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new post_1.PostController();
const validator = new post_2.PostValidator();
const middleware = new auth_1.Middleware();
const upload = (0, multer_1.default)(['image/png', 'image/jpg', 'image/jpeg', 'video/mp4', 'video/mkv', 'video/webm'], 200).array('media', 10);
router
    .route('/create')
    .post(upload, middleware.auth(['user']), validator.create, controller.create, (0, cache_1.clear)());
router
    .route('/like')
    .post(middleware.auth(['user']), validator.like, controller.like);
router
    .route('/create/comment')
    .post(middleware.auth(['user']), validator.comment, controller.comment);
router
    .route('/liked/comment')
    .post(middleware.auth(['user']), validator.likedComment, controller.likedComment);
router
    .route('/get/comment/:id')
    .get(middleware.auth(['user', 'admin']), controller.getComment);
router
    .route('/delete/comment')
    .delete(middleware.auth(['user', 'admin']), validator.likedComment, controller.deleteComment);
router
    .route('/all')
    .get(middleware.auth(['user']), (0, cache_1.get)(), controller.getAll, (0, cache_1.set)());
router
    .route('/find-with-category')
    .post(middleware.auth(['user']), (0, cache_1.get)(), validator.getWithCategory, controller.getWithCategory, (0, cache_1.set)());
router
    .route('/find-with-id')
    .post(middleware.auth(['user']), (0, cache_1.get)(), validator.getWithCategory, controller.getWithId, (0, cache_1.set)());
router
    .route('/alluser/:id')
    .get(middleware.auth(['user', 'admin']), (0, cache_1.get)(), controller.getUserPosts, (0, cache_1.set)());
router
    .route('/alladmin')
    .get(middleware.auth(['admin']), (0, cache_1.get)(), controller.getAllAdmin, (0, cache_1.set)());
router
    .route('/admin/:id')
    .get(middleware.auth(['admin']), controller.getOneAdmin);
router
    .route('/:id')
    .get(middleware.auth(['user']), (0, cache_1.get)(), controller.getOne, (0, cache_1.set)())
    .patch(middleware.auth(['user', 'admin']), validator.update, controller.update, (0, cache_1.clear)())
    .delete(middleware.auth(['admin', 'user']), controller.delete, (0, cache_1.clear)());
exports.default = router;
//# sourceMappingURL=post.js.map