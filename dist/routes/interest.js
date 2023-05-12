"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interest_1 = require("../controllers/interest");
const interets_1 = require("../validators/interets");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new interest_1.InterestController();
const validator = new interets_1.InterestValidator();
const middleware = new auth_1.Middleware();
const upload = (0, multer_1.default)(['image/png', 'image/jpg', 'image/jpeg'], 20).single('media');
router
    .route('/all')
    .get((0, cache_1.get)(), controller.getAll, (0, cache_1.set)());
router
    .route('/create')
    .post(upload, middleware.auth(['admin']), validator.create, controller.create, (0, cache_1.clear)());
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .delete(middleware.auth(['admin']), controller.delete, (0, cache_1.clear)());
exports.default = router;
//# sourceMappingURL=interest.js.map