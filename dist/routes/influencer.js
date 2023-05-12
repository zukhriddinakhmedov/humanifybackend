"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const influencer_1 = require("../controllers/influencer");
const influencer_2 = require("../validators/influencer");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new influencer_1.InfluencerController();
const validator = new influencer_2.InfluencerValidator();
const middleware = new auth_1.Middleware();
const upload = (0, multer_1.default)(['image/png', 'image/jpg', 'image/jpeg'], 20).array('avatar');
router.route('/create').post(validator.create, controller.create);
router.route('/login').post(validator.login, controller.login);
router.route('/all').get(controller.getAll);
router
    .route('/:id')
    .get(middleware.auth(['influencer']), controller.getOne)
    .patch(middleware.auth(['influencer']), upload, controller.update)
    .delete(middleware.auth(['influencer']), controller.delete);
exports.default = router;
//# sourceMappingURL=influencer.js.map