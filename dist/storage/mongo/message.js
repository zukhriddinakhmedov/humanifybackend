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
exports.MessageStorage = void 0;
const Message_1 = __importDefault(require("../../models/Message"));
const logger_1 = require("../../config/logger");
const appError_1 = __importDefault(require("../../utils/appError"));
class MessageStorage {
    constructor() {
        this.scope = 'storage.post';
    }
    find(sender_id, receiver_id, postLimit, postPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Message_1.default.aggregate([
                    { $match: { $and: [{ "sender_id": sender_id }, { "receiver_id": receiver_id }, { "sender_id": receiver_id }, { "receiver_id": sender_id }] } },
                    { $sort: { createdAt: -1 } },
                    { $skip: postPage },
                    { $limit: postLimit },
                ]);
                return dbObj;
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
                let dbObj = yield Message_1.default.findOne(Object.assign({}, query)).populate('owner_id', 'first_name last_name avatar');
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.get failed to findOne`);
                    throw new appError_1.default(404, 'post_404');
                }
                return dbObj;
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
                let dbObj = yield Message_1.default.create(payload);
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.create: finished with error: ${error}`);
                throw error;
            }
        });
    }
    update(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Message_1.default.findByIdAndUpdate(id, payload, {
                    new: true
                });
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.update failed to findByIdAndUpdate`);
                    throw new appError_1.default(404, 'admin_404');
                }
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.update: finished with error: ${error}`);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Message_1.default.findByIdAndDelete(id);
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.delete failed to findByIdAndDelete`);
                    throw new appError_1.default(404, 'admin_404');
                }
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.delete: finished with error: ${error}`);
                throw error;
            }
        });
    }
}
exports.MessageStorage = MessageStorage;
//# sourceMappingURL=message.js.map