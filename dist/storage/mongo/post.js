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
exports.PostStorage = void 0;
const Post_1 = __importDefault(require("../../models/Post"));
const logger_1 = require("../../config/logger");
const appError_1 = __importDefault(require("../../utils/appError"));
const Comment_1 = __importDefault(require("../../models/Comment"));
class PostStorage {
    constructor() {
        this.scope = 'storage.post';
    }
    findOneUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Post_1.default.aggregate([
                    { $match: { _id: id } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner_id",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    {
                        $addFields: {
                            userLiked: {
                                $in: [id, "$likes"],
                            },
                            likesAmount: {
                                $size: "$likes",
                            },
                        },
                    },
                    {
                        $unset: [
                            "likes",
                            "owner_id",
                            "creator.email",
                            "creator.followers",
                            "creator.follows",
                            "creator.interests",
                            "creator.posts",
                            "creator.notifications",
                            "creator.birthday",
                            "creator.gender",
                            "creator.password",
                            "creator.bio",
                            "creator.createdAt",
                            "creator.updatedAt",
                            "creator.__v"
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
    findOwnPosts(postLimit, postPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Post_1.default.aggregate([
                    {
                        $addFields: {
                            likesAmount: {
                                $size: "$likes",
                            },
                        },
                    },
                    { $skip: postPage },
                    { $limit: postLimit }
                ]);
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.find: finished with error: ${error}`);
                throw error;
            }
        });
    }
    findAdminUser(postLimit, postPage, searchValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = {};
                if (searchValue) {
                    dbObj = yield Post_1.default.aggregate([
                        { $match: { _id: searchValue } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner_id",
                                foreignField: "_id",
                                as: "creator",
                            },
                        },
                        {
                            $addFields: {
                                likesAmount: {
                                    $size: "$likes",
                                },
                            },
                        },
                        { $skip: postPage },
                        { $limit: postLimit },
                        {
                            $unset: [
                                "likes",
                                "owner_id",
                                "creator.email",
                                "creator.followers",
                                "creator.follows",
                                "creator.interests",
                                "creator.posts",
                                "creator.notifications",
                                "creator.birthday",
                                "creator.gender",
                                "creator.password",
                                "creator.bio",
                                "creator.createdAt",
                                "creator.updatedAt",
                                "creator.__v"
                            ],
                        }
                    ]);
                }
                else {
                    dbObj = yield Post_1.default.aggregate([
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner_id",
                                foreignField: "_id",
                                as: "creator",
                            },
                        },
                        {
                            $addFields: {
                                likesAmount: {
                                    $size: "$likes",
                                },
                            },
                        },
                        { $skip: postPage },
                        { $limit: postLimit },
                        {
                            $unset: [
                                "likes",
                                "owner_id",
                                "creator.email",
                                "creator.followers",
                                "creator.follows",
                                "creator.interests",
                                "creator.posts",
                                "creator.notifications",
                                "creator.birthday",
                                "creator.gender",
                                "creator.password",
                                "creator.bio",
                                "creator.createdAt",
                                "creator.updatedAt",
                                "creator.__v"
                            ],
                        }
                    ]);
                }
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.find: finished with error: ${error}`);
                throw error;
            }
        });
    }
    findLike(id, postLimit, postPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Post_1.default.aggregate([
                    { $match: { status: 'active' } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner_id",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    {
                        $addFields: {
                            userLiked: {
                                $in: [id, "$likes"],
                            },
                            likesAmount: {
                                $size: "$likes",
                            },
                        },
                    },
                    { $skip: postPage },
                    { $limit: postLimit },
                    {
                        $unset: [
                            "likes",
                            "owner_id",
                            "creator.email",
                            "creator.followers",
                            "creator.follows",
                            "creator.interests",
                            "creator.posts",
                            "creator.notifications",
                            "creator.birthday",
                            "creator.gender",
                            "creator.password",
                            "creator.bio",
                            "creator.createdAt",
                            "creator.updatedAt",
                            "creator.__v"
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
    findWithCategory(id, postLimit, postPage, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Post_1.default.aggregate([
                    {
                        $match: {
                            status: 'active',
                            category: {
                                $in: search
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner_id",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    {
                        $addFields: {
                            userLiked: {
                                $in: [id, "$likes"],
                            },
                            likesAmount: {
                                $size: "$likes",
                            },
                        },
                    },
                    { $skip: postPage },
                    { $limit: postLimit },
                    {
                        $unset: [
                            "likes",
                            "owner_id",
                            "creator.email",
                            "creator.followers",
                            "creator.follows",
                            "creator.interests",
                            "creator.posts",
                            "creator.notifications",
                            "creator.birthday",
                            "creator.gender",
                            "creator.password",
                            "creator.bio",
                            "creator.createdAt",
                            "creator.updatedAt",
                            "creator.__v"
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
    findWithId(id, postLimit, postPage, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Post_1.default.aggregate([
                    {
                        $match: {
                            status: 'active',
                            _id: { "$in": search },
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner_id",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    {
                        $addFields: {
                            userLiked: {
                                $in: [id, "$likes"],
                            },
                            likesAmount: {
                                $size: "$likes",
                            },
                        },
                    },
                    { $skip: postPage },
                    { $limit: postLimit },
                    {
                        $unset: [
                            "likes",
                            "owner_id",
                            "creator.email",
                            "creator.followers",
                            "creator.follows",
                            "creator.interests",
                            "creator.posts",
                            "creator.notifications",
                            "creator.birthday",
                            "creator.gender",
                            "creator.password",
                            "creator.bio",
                            "creator.createdAt",
                            "creator.updatedAt",
                            "creator.__v"
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
    findUserPosts(id, postLimit, postPage, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Post_1.default.aggregate([
                    { $match: { $and: [{ "status": "active" }, { "owner_id": user_id }] } },
                    { $sort: { createdAt: -1 } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner_id",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    {
                        $addFields: {
                            userLiked: {
                                $in: [id, "$likes"],
                            },
                            likesAmount: {
                                $size: "$likes",
                            },
                        },
                    },
                    { $skip: postPage },
                    { $limit: postLimit },
                    {
                        $unset: [
                            "likes",
                            "owner_id",
                            "creator.email",
                            "creator.followers",
                            "creator.follows",
                            "creator.interests",
                            "creator.posts",
                            "creator.notifications",
                            "creator.birthday",
                            "creator.gender",
                            "creator.password",
                            "creator.bio",
                            "creator.createdAt",
                            "creator.updatedAt",
                            "creator.__v"
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
    findComment(_id, postLimit, postPage, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Comment_1.default.aggregate([
                    { $match: { post_id: _id } },
                    { $sort: { createdAt: -1 } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "likes",
                            foreignField: "_id",
                            as: "liker",
                        },
                    },
                    {
                        $lookup: {
                            from: "comments",
                            localField: "reply_id",
                            foreignField: "_id",
                            as: "reply",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "reply.owner_id",
                            foreignField: "_id",
                            as: "username",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner_id",
                            foreignField: "_id",
                            as: "creator",
                        },
                    },
                    { $skip: postPage },
                    { $limit: postLimit },
                    {
                        $addFields: {
                            userLiked: {
                                $in: [id, "$likes"],
                            },
                            likesAmount: {
                                $size: "$likes",
                            },
                        },
                    },
                    {
                        $unset: [
                            "likes",
                            "owner_id",
                            "reply_id",
                            "liker.email",
                            "liker.first_name",
                            "liker.last_name",
                            "liker.avatar",
                            "liker.followers",
                            "liker.follows",
                            "liker.interests",
                            "liker.posts",
                            "liker.notifications",
                            "liker.birthday",
                            "liker.gender",
                            "liker.phone",
                            "liker.password",
                            "liker.bio",
                            "liker.type",
                            "liker.account_type",
                            "liker.status",
                            "liker.createdAt",
                            "liker.updatedAt",
                            "liker.__v",
                            "creator.email",
                            "creator.followers",
                            "creator.follows",
                            "creator.interests",
                            "creator.posts",
                            "creator.notifications",
                            "creator.birthday",
                            "creator.gender",
                            "creator.password",
                            "creator.bio",
                            "creator.phone",
                            "creator.type",
                            "creator.account_type",
                            "creator.status",
                            "creator.createdAt",
                            "creator.updatedAt",
                            "creator.__v",
                            "username.email",
                            "username.first_name",
                            "username.last_name",
                            "username.followers",
                            "username.follows",
                            "username.interests",
                            "username.posts",
                            "username.notifications",
                            "username.birthday",
                            "username.gender",
                            "username.password",
                            "username.bio",
                            "username.phone",
                            "username.type",
                            "username.account_type",
                            "username.status",
                            "username.createdAt",
                            "username.updatedAt",
                            "username.__v",
                            "username._id",
                            "username.avatar",
                            "reply.createdAt",
                            "reply.updatedAt",
                            "reply.post_id",
                            "reply.likes",
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
    updateMany(query, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Post_1.default.updateMany(query, payload);
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
                let dbObj = yield Post_1.default.findOne(Object.assign({}, query)).populate('owner_id', 'first_name last_name avatar username');
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
    findOneLike(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Post_1.default.findOne(Object.assign({}, query));
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
                let dbObj = yield Post_1.default.create(payload);
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
                let dbObj = yield Post_1.default.findByIdAndUpdate(id, payload, {
                    new: true
                });
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.update failed to findByIdAndUpdate`);
                    throw new appError_1.default(404, 'post_404');
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
                let dbObj = yield Post_1.default.findByIdAndDelete(id);
                if (!dbObj) {
                    logger_1.logger.warn(`${this.scope}.delete failed to findByIdAndDelete`);
                    throw new appError_1.default(404, 'post_404');
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
exports.PostStorage = PostStorage;
//# sourceMappingURL=post.js.map