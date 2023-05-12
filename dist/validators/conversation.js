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
exports.ConversationValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
class ConversationValidator {
    constructor() {
        this.createSchema = joi_1.default.object({
            receiver_id: joi_1.default.string().required()
        });
        // private updateSchema = Joi.object({
        //     sender_id: Joi.string(),
        //     receiver_id: Joi.array().items(Joi.string()),
        //     body: Joi.string()
        // })
        this.create = (0, catchAsync_1.default)((new_message, next) => __awaiter(this, void 0, void 0, function* () {
            const { error } = this.createSchema.validate(new_message);
            if (error)
                return next(error);
            next();
        }));
        // update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        //     const { error } = this.updateSchema.validate(req.body)
        //     if (error) return next(error)
        //     next()
        // })
    }
}
exports.ConversationValidator = ConversationValidator;
//# sourceMappingURL=conversation.js.map