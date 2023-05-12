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
exports.OTPValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class OTPValidator {
    constructor() {
        this.getPhoneSchema = joi_1.default.object({
            phone: joi_1.default.number(),
            email: joi_1.default.string().email(),
            forgotPassword: joi_1.default.boolean()
        });
        this.getCodeSchema = joi_1.default.object({
            code: joi_1.default.number().required(),
            phone: joi_1.default.number(),
            email: joi_1.default.string().email()
        });
        this.getUsernameSchema = joi_1.default.object({
            username: joi_1.default.string().required()
        });
        this.getPhone = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.getPhoneSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.getCode = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.getCodeSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
        this.getUsername = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.getUsernameSchema.validate(req.body);
            if (error)
                return next(error);
            next();
        }));
    }
}
exports.OTPValidator = OTPValidator;
//# sourceMappingURL=otp.js.map