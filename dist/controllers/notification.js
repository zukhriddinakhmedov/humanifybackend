"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const main_1 = require("../storage/main");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const get_message_1 = require("../locales/get_message");
class NotificationController {
    constructor() {
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const notifications = yield main_1.storage.notification.findAll(id);
            if (notifications.length) {
                // await storage.notification.delete(notifications[0].receiver_id)
                yield main_1.storage.user.update(id, { notifications: 0 });
            }
            res.status(200).json({
                success: true,
                data: {
                    notifications
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.response = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id, role } = res.locals;
            const { follower_id, response } = req.body;
            const request = yield main_1.storage.follows.findOne({ user_id: id, follower_id, status: 'pending' });
            if (response) {
                const toFollow = yield main_1.storage.user.find({ _id: follower_id });
                if (toFollow.length) {
                    yield main_1.storage.user.update(follower_id, { $inc: { follows: +1 } });
                    yield main_1.storage.user.update(id, { $inc: { followers: +1 } });
                    yield main_1.storage.follows.update(request._id, { status: 'active' });
                }
            }
            else {
                yield main_1.storage.follows.delete(request._id);
            }
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.getPendingRequests = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const user = yield main_1.storage.follows.findPending({ user_id: id, status: 'pending' });
            res.status(200).json({
                success: true,
                data: {
                    user
                },
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.delete = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const _id = req.params.id;
            yield main_1.storage.notification.delete(_id);
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.js.map