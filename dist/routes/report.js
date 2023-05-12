"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_1 = require("../controllers/report");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const report_2 = require("../validators/report");
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new report_1.ReportController();
const middleware = new auth_1.Middleware();
const validator = new report_2.ReportValidator();
router
    .route('/create')
    .post(middleware.auth(['user']), validator.create, controller.create, (0, cache_1.clear)());
router
    .route('/all')
    .get(middleware.auth(['admin']), (0, cache_1.get)(), controller.getAll, (0, cache_1.set)());
router
    .route('/:id')
    .patch(middleware.auth(['admin']), validator.update, controller.update, (0, cache_1.clear)())
    .delete(middleware.auth(['admin']), controller.delete, (0, cache_1.clear)());
// router
//     .route('/:category_id')
//     .patch(middleware.auth(['user']), controller.addPostToFavCategory, clear())
//     .delete(middleware.auth(['user']), controller.deletePostFromFavCategory, clear())
exports.default = router;
//# sourceMappingURL=report.js.map