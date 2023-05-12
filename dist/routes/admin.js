"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const admin_2 = require("../validators/admin");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../middleware/multer"));
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new admin_1.AdminController();
const validator = new admin_2.AdminValidator();
const middleware = new auth_1.Middleware();
const upload = (0, multer_1.default)(['image/png', 'image/jpg', 'image/jpeg'], 20).single('avatar');
router
    .route('/create/superadmin')
    .post(validator.create, controller.createSuperAdmin, (0, cache_1.clear)());
router
    .route('/create/influencer')
    .post(middleware.auth(['admin']), validator.createInfluencer, controller.createInfluencer);
router
    .route('/all')
    .get(middleware.auth(['admin']), (0, cache_1.get)(), controller.getAll, (0, cache_1.set)());
router
    .route('/create')
    .post(middleware.auth(['admin']), validator.create, controller.create, (0, cache_1.clear)());
router
    .route('/makeinfluensers')
    .get(middleware.auth(['admin']), controller.getAllMakeInfluencers);
router
    .route('/login')
    .post(validator.login, controller.login);
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .patch(upload, middleware.auth(['admin']), validator.update, controller.update, (0, cache_1.clear)())
    .delete(middleware.auth(['admin']), controller.delete, (0, cache_1.clear)());
exports.default = router;
//# sourceMappingURL=admin.js.map