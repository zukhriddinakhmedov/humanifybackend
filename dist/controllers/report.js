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
exports.ReportController = void 0;
const main_1 = require("../storage/main");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const get_message_1 = require("../locales/get_message");
class ReportController {
    constructor() {
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { status, type, limit, page } = req.query;
            const postLimit = Number(limit);
            let postPage = Number(page);
            postPage = postLimit * postPage;
            let reports = yield main_1.storage.report.findAll(status, type, postLimit, postPage);
            res.status(200).json({
                success: true,
                data: {
                    reports
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            req.body.owner_id = id;
            yield main_1.storage.report.create(req.body);
            res.status(201).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const _id = req.params.id;
            const { status } = req.query;
            yield main_1.storage.report.updateMany({ receiver_id: _id }, { status: status });
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.delete = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const _id = req.params.id;
            yield main_1.storage.report.delete(_id);
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=report.js.map