"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorite_1 = require("../controllers/favorite");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new favorite_1.FavoriteController();
const middleware = new auth_1.Middleware();
const upload = (0, multer_1.default)(['image/png', 'image/jpg', 'image/jpeg'], 20).single('image');
router
    .route('/all')
    .get(middleware.auth(['admin']), (0, cache_1.get)(), controller.getAll, (0, cache_1.set)());
router
    .route('/')
    .get(middleware.auth(['user']), controller.getOne)
    .patch(upload, middleware.auth(['user']), controller.createFavCategory, (0, cache_1.clear)())
    .delete(middleware.auth(['user']), controller.deleteFavCategory, (0, cache_1.clear)());
router
    .route('/:category_id')
    .patch(middleware.auth(['user']), controller.addPostToFavCategory, (0, cache_1.clear)())
    .delete(middleware.auth(['user']), controller.deletePostFromFavCategory, (0, cache_1.clear)());
exports.default = router;
//# sourceMappingURL=favorite.js.map