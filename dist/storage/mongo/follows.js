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
exports.FollowsStorage = void 0;
const Follows_1 = __importDefault(require("../../models/Follows"));
const logger_1 = require("../../config/logger");
const appError_1 = __importDefault(require("../../utils/appError"));
class FollowsStorage {
    constructor() {
        this.scope = 'storage.follows';
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Follows_1.default.find(Object.assign({}, query));
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.find: finished with error: ${error}`);
                throw error;
            }
        });
    }
    findIn(query, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Follows_1.default.find({ 'user_id': { $in: query }, 'follower_id': id });
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.find: finished with error: ${error}`);
                throw error;
            }
        });
    }
    findPending(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(query.limit) || 9;
                const page = parseInt(query.page) || 1;
                let previous = true;
                let next = true;
                delete query.limit;
                delete query.page;
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                const result = yield Follows_1.default.find(Object.assign({}, query)).populate([
                    { path: 'follower_id', select: 'first_name last_name category avatar type username' },
                    { path: 'user_id', select: 'first_name last_name category avatar type username' }
                ]).limit(limit * 1).skip(startIndex).exec();
                const nextPage = yield Follows_1.default.find(Object.assign({}, query)).limit(limit * 1).skip(endIndex).exec();
                if (page === 1) {
                    previous = false;
                }
                if (!nextPage.length) {
                    next = false;
                }
                let dbObj = {
                    result,
                    next,
                    previous
                };
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
                let dbObj = yield Follows_1.default.findOne(Object.assign({}, query));
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.get failed to findOne`);
                    throw new appError_1.default(404, 'follow_404');
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
                let dbObj = yield Follows_1.default.create(payload);
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
                let dbObj = yield Follows_1.default.findByIdAndUpdate(id, payload, {
                    new: true
                });
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.update failed to findByIdAndUpdate`);
                    throw new appError_1.default(404, 'follow_404');
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
                let dbObj = yield Follows_1.default.findByIdAndDelete(id);
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.delete failed to findByIdAndDelete`);
                    throw new appError_1.default(404, 'follow_404');
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
exports.FollowsStorage = FollowsStorage;
//# sourceMappingURL=follows.js.map