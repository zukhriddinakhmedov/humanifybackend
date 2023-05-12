"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_1 = require("../controllers/message");
const message_2 = require("../validators/message");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../middleware/multer"));
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new message_1.MessageController();
const validator = new message_2.MessageValidator();
const middleware = new auth_1.Middleware();
const upload = (0, multer_1.default)(['image/png', 'image/jpg', 'image/jpeg', 'video/mp4', 'video/mkv', 'video/webm'], 20).array('media', 10);
router
    .route('/create')
    .post(upload, middleware.auth(['user']), validator.create, controller.create, (0, cache_1.clear)());
router
    .route('/all')
    .post(middleware.auth(['user']), (0, cache_1.get)(), controller.getAll, (0, cache_1.set)());
router
    .route('/:id')
    .get(middleware.auth(['user']), controller.getOne)
    .patch(middleware.auth(['user', 'admin']), validator.update, controller.update, (0, cache_1.clear)())
    .delete(middleware.auth(['admin', 'user']), controller.delete, (0, cache_1.clear)());
exports.default = router;
//# sourceMappingURL=message.js.map