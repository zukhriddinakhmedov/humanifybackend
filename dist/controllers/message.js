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
exports.MessageController = void 0;
const main_1 = require("../storage/main");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const get_message_1 = require("../locales/get_message");
const appError_1 = __importDefault(require("../utils/appError"));
class MessageController {
    constructor() {
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { receiver_id } = req.body;
            const { limit, page } = req.query;
            const postLimit = Number(limit);
            let postPage = Number(page);
            postPage = postLimit * postPage;
            const messages = yield main_1.storage.message.find(id, receiver_id, postLimit, postPage);
            res.status(200).json({
                success: true,
                data: {
                    messages
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const _id = req.params.id;
            const single_message = yield main_1.storage.message.findOne({ _id });
            res.status(200).json({
                success: true,
                data: {
                    single_message
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.create = (0, catchAsync_1.default)((message, next) => __awaiter(this, void 0, void 0, function* () {
            // const getUser = await storage.user.findOne({ _id: id })
            // req.body.owner_id = id
            const new_message = yield main_1.storage.message.create(message);
            // getUser.messages.push(new_message._id)
            // await storage.user.update(id, { messages: getUser.messages })
        }));
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id, role } = res.locals;
            const _id = req.params.id;
            const message_to_update = yield main_1.storage.message.findOne({ _id });
            if (message_to_update.sender_id !== id) {
                return next(new appError_1.default(403, 'auth_403'));
            }
            else {
                const updated_message = yield main_1.storage.message.update({ _id }, req.body);
                res.status(200).json({
                    success: true,
                    data: {
                        updated_message
                    },
                    message: (0, get_message_1.message)('message_updated_200', lang)
                });
            }
        }));
        this.delete = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, lang } = res.locals;
            const _id = req.params.id;
            const message_to_update = yield main_1.storage.message.findOne({ _id });
            if (message_to_update.sender_id !== id) {
                return next(new appError_1.default(403, 'auth_403'));
            }
            else {
                yield main_1.storage.message.delete({ _id });
                res.status(200).json({
                    success: true,
                    message: (0, get_message_1.message)('message_delete_200', lang)
                });
            }
        }));
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=message.js.map