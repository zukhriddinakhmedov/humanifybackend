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
exports.PostValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class PostValidator {
    constructor() {
        this.createSchema = joi_1.default.object({
            category: joi_1.default.array().items(joi_1.default.string()),
            body: joi_1.default.string()
        });
        this.likeSchema = joi_1.default.object({
            target_id: joi_1.default.string().required(),
        });
        this.findWithCategory = joi_1.default.object({
            search: joi_1.default.array().items(joi_1.default.string()).required()
        });
        this.commentSchema = joi_1.default.object({
            post_id: joi_1.default.string().required(),
            reply_id: joi_1.default.string(),
            body: joi_1.default.string().required()
        });
        this.likedCommentSchema = joi_1.default.object({
            comment_id: joi_1.default.string().required()
        });
        this.updateSchema = joi_1.default.object({
            category: joi_1.default.array().items(joi_1.default.string()),
            body: joi_1.default.string(),
            status: joi_1.default.string().valid('active', 'inactive'),
        });
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.category) {
                req.body.category = JSON.parse(req.body.category);
            }
            const { error } = this.createSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.like = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.likeSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.comment = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.commentSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.likedComment = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.likedCommentSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.getWithCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.findWithCategory.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.updateSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
    }
}
exports.PostValidator = PostValidator;
//# sourceMappingURL=post.js.map