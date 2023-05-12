"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_1 = require("../controllers/notification");
const auth_1 = require("../middleware/auth");
const response_1 = require("../validators/response");
const router = (0, express_1.Router)({ mergeParams: true });
const validator = new response_1.ResponseValidator();
const controller = new notification_1.NotificationController();
const middleware = new auth_1.Middleware();
router.route('/all').get(middleware.auth(['user']), controller.getAll);
router.route('/response').post(middleware.auth(['user']), validator.create, controller.response);
router.route('/pendingrequests').get(middleware.auth(['user']), controller.getPendingRequests);
router
    .route('/:id')
    .delete(middleware.auth(['user']), controller.delete);
//     .patch(middleware.auth(['influencer']), controller.update)
//     .delete(middleware.auth(['influencer']), controller.delete)
exports.default = router;
//# sourceMappingURL=notification.js.map