"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversation_1 = require("../controllers/conversation");
const conversation_2 = require("../validators/conversation");
const auth_1 = require("../middleware/auth");
const cache_1 = require("../middleware/cache");
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new conversation_1.ConversationController();
const validator = new conversation_2.ConversationValidator();
const middleware = new auth_1.Middleware();
router
    .route('/all')
    .get(middleware.auth(['user']), (0, cache_1.get)(), controller.getAll, (0, cache_1.set)());
router
    .route('/create')
    .post(middleware.auth(['user']), validator.create, controller.create, (0, cache_1.clear)());
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne)
    .delete(middleware.auth(['admin']), controller.delete, (0, cache_1.clear)());
exports.default = router;
//# sourceMappingURL=conversation.js.map