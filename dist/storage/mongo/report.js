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
exports.ReportStorage = void 0;
const Report_1 = __importDefault(require("../../models/Report"));
const logger_1 = require("../../config/logger");
const appError_1 = __importDefault(require("../../utils/appError"));
class ReportStorage {
    constructor() {
        this.scope = 'storage.report';
    }
    findAll(status, type, postLimit, postPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Report_1.default.aggregate([
                    { $match: { status: status, collection_type: type } },
                    {
                        $lookup: {
                            from: 'users',
                            localField: "owner_id",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    { $group: { _id: "$receiver_id", content: { $push: "$$ROOT" } } },
                    {
                        $lookup: {
                            from: type,
                            localField: "_id",
                            foreignField: "_id",
                            as: "content_category",
                        },
                    },
                    {
                        $addFields: {
                            contentAmount: {
                                $size: "$content",
                            },
                        },
                    },
                    { $sort: { contentAmount: -1 } },
                    { $skip: postPage },
                    { $limit: postLimit },
                    {
                        $unset: [
                            "content.creator.email",
                            "content.creator.followers",
                            "content.creator.follows",
                            "content.creator.interests",
                            "content.creator.posts",
                            "content.creator.notifications",
                            "content.creator.birthday",
                            "content.creator.gender",
                            "content.creator.password",
                            "content.creator.bio",
                            "content.creator.createdAt",
                            "content.creator.updatedAt",
                            "content.creator.__v",
                            "content.status",
                            "content.receiver_id",
                            "content.collection_type",
                            "content.owner_id",
                            "content.__v",
                            "content_category.likes",
                            "content_category.__v",
                            "content_category.createdAt",
                            "content_category.updatedAt",
                            "content_category.owner_type",
                            "content_category.comments",
                            "content_category.views",
                            "content_category.category",
                            "content_category.followers",
                            "content_category.follows",
                            "content_category.interests",
                            "content_category.posts",
                            "content_category.notifications",
                            "content_category.gender",
                            "content_category.password",
                            "content_category.email",
                            "content_category.phone"
                        ],
                    }
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
                let dbObj = yield Report_1.default.findOne(Object.assign({}, query));
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.get failed to findOne`);
                    throw new appError_1.default(404, 'report_404');
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
                let dbObj = yield Report_1.default.create(payload);
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.create: finished with error: ${error}`);
                throw error;
            }
        });
    }
    updateMany(query, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Report_1.default.updateMany(query, payload);
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.find: finished with error: ${error}`);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Report_1.default.deleteMany({ receiver_id: id });
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.delete failed to findByIdAndDelete`);
                    throw new appError_1.default(404, 'report_404');
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
exports.ReportStorage = ReportStorage;
//# sourceMappingURL=report.js.map