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
exports.AdminValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class AdminValidator {
    constructor() {
        this.pattern = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;'<>,.?/_₹]).{8,30}$/;
        this.createSchema = joi_1.default.object({
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            phone: joi_1.default.string().required(),
            login: joi_1.default.string().required(),
            password: joi_1.default.string().regex(this.pattern).required(),
        });
        this.createInfluencerSchema = joi_1.default.object({
            response: joi_1.default.boolean().required(),
            user_id: joi_1.default.string().required(),
            account_type: joi_1.default.string().valid('user', 'professional', 'business').required()
        });
        this.loginSchema = joi_1.default.object({
            login: joi_1.default.string().required(),
            password: joi_1.default.string().required()
        });
        this.updateSchema = joi_1.default.object({
            first_name: joi_1.default.string(),
            last_name: joi_1.default.string(),
            email: joi_1.default.string().email(),
            phone: joi_1.default.string(),
            login: joi_1.default.string(),
            old_password: joi_1.default.string(),
            new_password: joi_1.default.string().regex(this.pattern),
            status: joi_1.default.string().valid('active', 'inactive')
        });
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.createSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.createInfluencer = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.createInfluencerSchema.validate(req.body);
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
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.updateSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
    }
}
exports.AdminValidator = AdminValidator;
//# sourceMappingURL=admin.js.map