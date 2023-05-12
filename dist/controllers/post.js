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
exports.PostController = void 0;
const main_1 = require("../storage/main");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const get_message_1 = require("../locales/get_message");
const uuid_1 = require("uuid");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
class PostController {
    constructor() {
        this.getOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const _id = req.params.id;
            const post = yield main_1.storage.post.findOneUser(_id);
            res.status(200).json({
                success: true,
                data: {
                    post
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { limit, page } = req.query;
            const postLimit = Number(limit);
            let postPage = Number(page);
            postPage = postLimit * postPage;
            const post = yield main_1.storage.post.findLike(id, postLimit, postPage);
            res.status(200).json({
                success: true,
                data: {
                    post
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getWithCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { search } = req.body;
            const { limit, page } = req.query;
            const postLimit = Number(limit);
            let postPage = Number(page);
            postPage = postLimit * postPage;
            const post = yield main_1.storage.post.findWithCategory(id, postLimit, postPage, search);
            res.status(200).json({
                success: true,
                data: {
                    post
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getWithId = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { search } = req.body;
            const { limit, page } = req.query;
            const postLimit = Number(limit);
            let postPage = Number(page);
            postPage = postLimit * postPage;
            const post = yield main_1.storage.post.findWithId(id, postLimit, postPage, search);
            res.status(200).json({
                success: true,
                data: {
                    post
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getUserPosts = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id, role } = res.locals;
            const { limit, page } = req.query;
            const user_id = req.params.id;
            const postLimit = Number(limit);
            let postPage = Number(page);
            postPage = postLimit * postPage;
            let post;
            if (user_id !== id) {
                post = yield main_1.storage.post.findUserPosts(id, postLimit, postPage, user_id);
            }
            else if (user_id === id || role === 'admin') {
                post = yield main_1.storage.post.findOwnPosts(postLimit, postPage);
            }
            res.status(200).json({
                success: true,
                data: {
                    post
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getAllAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { limit, page, search } = req.query;
            const postLimit = Number(limit);
            let postPage = Number(page);
            postPage = postLimit * postPage;
            const post = yield main_1.storage.post.findAdminUser(postLimit, postPage, search);
            res.status(200).json({
                success: true,
                data: {
                    post
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getOneAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const _id = req.params.id;
            const post = yield main_1.storage.post.findOne({ _id });
            res.status(200).json({
                success: true,
                data: {
                    post
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.like = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { target_id } = req.body;
            const post = yield main_1.storage.post.findOneLike({ _id: target_id, status: 'active' });
            if (post.likes.includes(id)) {
                post.likes.splice(post.likes.indexOf(id), 1);
                yield main_1.storage.post.update({ _id: target_id }, { likes: post.likes });
            }
            else {
                yield main_1.storage.post.update({ _id: target_id }, { $push: { likes: id } });
                if (post.owner_id !== id) {
                    const obj2 = {
                        receiver_id: post.owner_id,
                        post_id: post._id,
                        type: 'like',
                        follower_id: id
                    };
                    yield main_1.storage.notification.create(obj2);
                    yield main_1.storage.user.update(post.owner_id, { $inc: { notifications: +1 } });
                }
            }
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.comment = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { post_id } = req.body;
            const post = yield main_1.storage.post.findOneLike({ _id: post_id, status: 'active' });
            req.body.owner_id = id;
            const comments = yield main_1.storage.comment.create(req.body);
            if (post.owner_id !== id) {
                const obj2 = {
                    receiver_id: post.owner_id,
                    post_id: post._id,
                    type: 'comment',
                    follower_id: id
                };
                yield main_1.storage.notification.create(obj2);
                yield main_1.storage.user.update(post.owner_id, { $inc: { notifications: +1 } });
            }
            yield main_1.storage.post.update(post_id, { $inc: { comments: +1 } });
            res.status(200).json({
                success: true,
                data: {
                    comments
                },
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.likedComment = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { comment_id } = req.body;
            const comment = yield main_1.storage.comment.findOne({ _id: comment_id });
            if (comment.likes.includes(id)) {
                comment.likes.splice(comment.likes.indexOf(id), 1);
                yield main_1.storage.comment.update({ _id: comment_id }, { likes: comment.likes });
            }
            else {
                yield main_1.storage.comment.update({ _id: comment_id }, { $push: { likes: id } });
            }
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.getComment = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const _id = req.params.id;
            const { limit, page } = req.query;
            const postLimit = Number(limit);
            let postPage = Number(page);
            postPage = postLimit * postPage;
            const comments = yield main_1.storage.post.findComment(_id, postLimit, postPage, id);
            res.status(200).json({
                success: true,
                data: {
                    comments
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.deleteComment = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id, role } = res.locals;
            const { comment_id } = req.body;
            const comment = yield main_1.storage.comment.findOne({ _id: comment_id });
            if (comment.owner_id !== id && role !== 'admin') {
                return next(new appError_1.default(401, 'auth_403'));
            }
            yield main_1.storage.comment.delete(comment_id);
            yield main_1.storage.post.update(comment.post_id, { $inc: { comments: -1 } });
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const user = yield main_1.storage.user.findOne({ _id: id });
            req.body.owner_type = user.account_type;
            req.body.owner_id = id;
            const media = [];
            if (req.files) {
                const url = req.files;
                for (let i = 0; i < url.length; i++) {
                    const fileName = `${url[i].fieldname}-${(0, uuid_1.v4)()}.${url[i].mimetype.split('/')[1]}`;
                    yield fs_1.default.promises.writeFile((0, path_1.join)(__dirname, '../../../uploads/postMedia', fileName), url[i].buffer);
                    const obj = {
                        url: fileName,
                        type: url[i].mimetype.split('/')[0]
                    };
                    media.push(obj);
                }
                req.body.media = media;
            }
            const post = yield main_1.storage.post.create(req.body);
            yield main_1.storage.user.update(id, { $inc: { posts: +1 } });
            res.status(201).json({
                success: true,
                data: {
                    post
                },
                message: (0, get_message_1.message)('post_created_200', lang)
            });
        }));
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id, role } = res.locals;
            const _id = req.params.id;
            if (role === 'user') {
                if (req.body.status) {
                    return next(new appError_1.default(403, 'auth_403'));
                }
                yield main_1.storage.post.findOne({ _id, owner_id: id });
            }
            const post = yield main_1.storage.post.update({ _id }, req.body);
            res.status(200).json({
                success: true,
                data: {
                    post
                },
                message: (0, get_message_1.message)('post_updated_200', lang)
            });
        }));
        this.delete = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, lang, role } = res.locals;
            const _id = req.params.id;
            let post;
            let user;
            if (role === 'user') {
                user = yield main_1.storage.user.findOne({ _id: id });
                post = yield main_1.storage.post.findOne({ _id, owner_id: id });
            }
            else {
                post = yield main_1.storage.post.findOne({ _id });
                user = yield main_1.storage.user.findOne({ _id: post.owner_id });
            }
            const obj = {
                _id: post._id,
                owner_id: post.owner_id,
                category: post.category,
                body: post.body,
                media: post.media,
                likes: post.likes,
                comments: post.comments,
                views: post.views
            };
            yield main_1.storage.deletedPost.create(obj);
            yield main_1.storage.post.delete({ _id });
            yield main_1.storage.user.update(user._id, { $inc: { posts: -1 } });
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('post_deleted_200', lang)
            });
        }));
    }
}
exports.PostController = PostController;
//# sourceMappingURL=post.js.map