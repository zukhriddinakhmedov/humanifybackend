"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deletedUser_1 = require("../controllers/deletedUser");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)({ mergeParams: true });
const controller = new deletedUser_1.DeletedUserController();
const middleware = new auth_1.Middleware();
router
    .route('/all')
    .get(middleware.auth(['admin']), controller.getAll);
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.getOne);
// .delete(middleware.auth(['admin']), controller.delete)
exports.default = router;
//# sourceMappingURL=deletedUser.js.map