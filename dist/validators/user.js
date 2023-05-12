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
exports.UserValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class UserValidator {
    constructor() {
        this.passwordPattern = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;'<>,.?/_₹]).{8,30}$/;
        this.usernamePattern = /^(?!.*\s)(?=.*[A-Z])|(?=.*[a-z]).{5,}$/;
        this.createSchema = joi_1.default.object({
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            email: joi_1.default.string().email(),
            birthday: joi_1.default.string().required(),
            interests: joi_1.default.array().items(joi_1.default.string()),
            username: joi_1.default.string().regex(this.usernamePattern).required(),
            gender: joi_1.default.string().valid('Male', 'Female').required(),
            phone: joi_1.default.number(),
            password: joi_1.default.string().regex(this.passwordPattern).required(),
            status: joi_1.default.forbidden(),
            account_type: joi_1.default.forbidden(),
            type: joi_1.default.string().valid('private', 'public').required()
        });
        this.loginSchema = joi_1.default.object({
            username: joi_1.default.string().required(),
            password: joi_1.default.string().required()
        });
        this.followSchema = joi_1.default.object({
            following: joi_1.default.string().required()
        });
        this.updateSchema = joi_1.default.object({
            first_name: joi_1.default.string(),
            last_name: joi_1.default.string(),
            email: joi_1.default.forbidden(),
            birthday: joi_1.default.forbidden(),
            address: {
                long: joi_1.default.number().required(),
                lat: joi_1.default.number().required(),
            },
            gender: joi_1.default.forbidden(),
            username: joi_1.default.string().regex(this.usernamePattern),
            bio: joi_1.default.string(),
            category: joi_1.default.string(),
            phone: joi_1.default.forbidden(),
            old_password: joi_1.default.string(),
            new_password: joi_1.default.string().regex(this.passwordPattern),
            status: joi_1.default.string().valid('active', 'inactive'),
            type: joi_1.default.string().valid('private', 'public'),
            account_type: joi_1.default.string().valid('user', 'business', 'professional'),
            interests: joi_1.default.array().items(joi_1.default.string())
        });
        this.makeInfluencerSchema = joi_1.default.object({
            description: joi_1.default.string().required(),
            influencer_type: joi_1.default.string().valid('business', 'professional').required()
        });
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.createSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.loginSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.follow = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.followSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.makeInfluencer = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.makeInfluencerSchema.validate(req.body);
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
exports.UserValidator = UserValidator;
//# sourceMappingURL=user.js.map