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
exports.DeletedUserController = void 0;
const express_1 = require("express");
const main_1 = require("../storage/main");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const get_message_1 = require("../locales/get_message");
class DeletedUserController {
    constructor() {
        this.getOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const _id = req.params.id;
            let deletedUser = yield main_1.storage.deletedUser.findOne({ _id });
            res.status(200).json({
                success: true,
                data: {
                    deletedUser
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            let deletedUsers = yield main_1.storage.deletedUser.find(express_1.query);
            res.status(200).json({
                success: true,
                data: {
                    deletedUsers
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        // delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        //     const { lang } = res.locals
        //     const _id = req.params.id
        //     await storage.deletedUser.delete(_id)
        //     res.status(200).json({
        //         success: true,
        //         message: message('otp_200', lang)
        //     })
        // })
    }
}
exports.DeletedUserController = DeletedUserController;
//# sourceMappingURL=deletedUser.js.map