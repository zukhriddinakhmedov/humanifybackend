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
exports.OTPStorage = void 0;
const OTP_1 = __importDefault(require("../../models/OTP"));
const logger_1 = require("../../config/logger");
const appError_1 = __importDefault(require("../../utils/appError"));
class OTPStorage {
    constructor() {
        this.scope = 'storage.OTP';
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpes = yield OTP_1.default.find(query);
                return otpes;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.find: finished with error: ${error}`);
                throw error;
            }
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield OTP_1.default.findOne(query);
                if (!otp) {
                    logger_1.logger.warn(`${this.scope}.get failed to findOne`);
                    throw new appError_1.default(404, 'otp_404');
                }
                return otp;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.findOne: finished with error: ${error}`);
                throw error;
            }
        });
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newOTP = yield OTP_1.default.create(payload);
                return newOTP;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.create: finished with error: ${error}`);
                throw error;
            }
        });
    }
    update(query, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield OTP_1.default.findOneAndUpdate(query, payload, {
                    new: true
                });
                if (!otp) {
                    logger_1.logger.warn(`${this.scope}.update failed to findOneAndUpdate`);
                    throw new appError_1.default(404, 'otp_404');
                }
                return otp;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.update: finished with error: ${error}`);
                throw error;
            }
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield OTP_1.default.findOneAndDelete(query);
                if (!otp) {
                    logger_1.logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
                    throw new appError_1.default(404, 'otp_404');
                }
                return otp;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.delete: finished with error: ${error}`);
                throw error;
            }
        });
    }
}
exports.OTPStorage = OTPStorage;
//# sourceMappingURL=otp.js.map