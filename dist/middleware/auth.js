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
exports.Middleware = exports.decodeToken = exports.signToken = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const main_1 = require("../storage/main");
const signToken = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign({ id, role }, config_1.default.JwtSecret, { expiresIn: config_1.default.Lifetime });
});
exports.signToken = signToken;
const decodeToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (yield jsonwebtoken_1.default.verify(token, config_1.default.JwtSecret));
    return decoded;
});
exports.decodeToken = decodeToken;
class Middleware {
    constructor() {
        this.auth = (roles) => {
            return (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                const token = req.headers.authorization;
                if (!token) {
                    return next(new appError_1.default(403, 'auth_403'));
                }
                const decoded = (0, exports.decodeToken)(token);
                const role = (yield decoded).role;
                if (!roles.includes(role)) {
                    return next(new appError_1.default(403, 'auth_403'));
                }
                res.locals.id = (yield decoded).id;
                res.locals.role = (yield decoded).role;
                if (role === 'user') {
                    yield main_1.storage.user.findOne({ _id: res.locals.id });
                }
                else if (role === 'admin') {
                    yield main_1.storage.admin.findSuperAdmin({ _id: res.locals.id, status: "active" });
                }
                next();
            }));
        };
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=auth.js.map