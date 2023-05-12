"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const path_1 = __importDefault(require("path"));
const admin_1 = __importDefault(require("./admin"));
const user_1 = __importDefault(require("./user"));
const interest_1 = __importDefault(require("./interest"));
const post_1 = __importDefault(require("./post"));
const notification_1 = __importDefault(require("./notification"));
const favorite_1 = __importDefault(require("./favorite"));
const report_1 = __importDefault(require("./report"));
const deletedUser_1 = __importDefault(require("./deletedUser"));
const message_1 = __importDefault(require("./message"));
const conversation_1 = __importDefault(require("./conversation"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)({ mergeParams: true });
const middleware = new auth_1.Middleware();
router.use('/file', middleware.auth(['admin', 'user']), express_1.default.static(path_1.default.join(__dirname, '../../../uploads')));
router.use('/interestfile', express_1.default.static(path_1.default.join(__dirname, '../../../interests')));
router.use('/admin', admin_1.default);
router.use('/users', user_1.default);
router.use('/interests', interest_1.default);
router.use('/posts', post_1.default);
router.use('/notifications', notification_1.default);
router.use('/favorite', favorite_1.default);
router.use('/report', report_1.default);
router.use('/deleteduser', deletedUser_1.default);
router.use('/message', message_1.default);
router.use('/conversation', conversation_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map