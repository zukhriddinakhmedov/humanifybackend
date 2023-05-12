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
exports.InterestController = void 0;
const main_1 = require("../storage/main");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const get_message_1 = require("../locales/get_message");
const uuid_1 = require("uuid");
const path_1 = require("path");
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = require("fs/promises");
class InterestController {
    constructor() {
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            let interests;
            if (lang === 'uz') {
                interests = yield main_1.storage.interestUZ.find(req.query);
            }
            else if (lang === 'ru') {
                interests = yield main_1.storage.interestRU.find(req.query);
            }
            res.status(200).json({
                success: true,
                data: {
                    interests
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const _id = req.params.id;
            let interest;
            if (lang === 'uz') {
                interest = yield main_1.storage.interestUZ.findOne({ _id });
            }
            else if (lang === 'ru') {
                interest = yield main_1.storage.interestRU.findOne({ _id });
            }
            res.status(200).json({
                success: true,
                data: {
                    interest
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { titleRU, titleUZ } = req.body;
            if (req.file) {
                const photo = `interestMedia/${req.file.fieldname}-${(0, uuid_1.v4)()}.png`;
                yield (0, sharp_1.default)(req.file.buffer).png().toFile((0, path_1.join)(__dirname, '../../../interests', photo));
                req.body.media = photo;
            }
            const interestUZ = yield main_1.storage.interestUZ.create({ title: titleUZ, media: req.body.media });
            yield main_1.storage.interestRU.create({ title: titleRU, refId: interestUZ._id, media: req.body.media });
            yield main_1.storage.interestUZ.update(interestUZ._id, { refId: interestUZ._id });
            res.status(201).json({
                success: true,
                message: (0, get_message_1.message)('interest_created_200', lang)
            });
        }));
        this.delete = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, lang } = res.locals;
            const _id = req.params.id;
            const interestUZ = yield main_1.storage.interestUZ.findOne({ _id });
            const interestRU = yield main_1.storage.interestRU.findOne({ refId: interestUZ._id });
            if (interestUZ.media) {
                yield (0, promises_1.unlink)((0, path_1.join)(__dirname, '../../../interests', interestUZ.media));
            }
            yield main_1.storage.interestUZ.delete({ _id });
            yield main_1.storage.interestRU.delete({ _id: interestRU._id });
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('interest_delete_200', lang)
            });
        }));
    }
}
exports.InterestController = InterestController;
//# sourceMappingURL=interest.js.map