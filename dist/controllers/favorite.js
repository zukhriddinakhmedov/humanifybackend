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
exports.FavoriteController = void 0;
const main_1 = require("../storage/main");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const get_message_1 = require("../locales/get_message");
const uuid_1 = require("uuid");
const path_1 = require("path");
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = require("fs/promises");
class FavoriteController {
    constructor() {
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const favorite = yield main_1.storage.favorites.find(req.query);
            res.status(200).json({
                success: true,
                data: {
                    favorite
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const favorite = yield main_1.storage.favorites.findOne({ user_id: id });
            res.status(200).json({
                success: true,
                data: {
                    favorite
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.createFavCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { title } = req.body;
            const _id = req.params.id;
            const favoriteToBeModified = yield main_1.storage.favorites.findOne({ user_id: id });
            const categoryExists = favoriteToBeModified.body.findIndex(fav => fav.name.toLowerCase() === title.toLowerCase());
            if (favoriteToBeModified) {
                if (title && title.length > 0) {
                    if (categoryExists === -1) {
                        let image;
                        if (req.file) {
                            const photo = `favoriteImage/${req.file.fieldname}-${(0, uuid_1.v4)()}.png`;
                            yield (0, sharp_1.default)(req.file.buffer).png().toFile((0, path_1.join)(__dirname, '../../../uploads', photo));
                            image = photo;
                        }
                        const newFavCategory = { name: title, list: [], image };
                        favoriteToBeModified.body.push(newFavCategory);
                        const favorite = yield main_1.storage.favorites.update(favoriteToBeModified._id, favoriteToBeModified);
                        res.status(200).json({
                            success: true,
                            data: {
                                favorite
                            },
                            message: (0, get_message_1.message)('fav_updated_200', lang)
                        });
                    }
                    else {
                        return next(new appError_1.default(400, 'duplicate_category_401'));
                    }
                }
                else {
                    return next(new appError_1.default(400, 'no_title_401'));
                }
            }
            else {
                if (req.body.status) {
                    return next(new appError_1.default(403, 'auth_403'));
                }
            }
        }));
        this.deleteFavCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { category_id } = req.body;
            const favoriteToBeModified = yield main_1.storage.favorites.findOne({ user_id: id });
            if (favoriteToBeModified) {
                const index = favoriteToBeModified.body.findIndex((category) => category._id == category_id);
                if (index !== -1) {
                    yield (0, promises_1.unlink)((0, path_1.join)(__dirname, '../../../uploads', favoriteToBeModified.body[index].image));
                    favoriteToBeModified.body.splice(index, 1);
                    const favorite = yield main_1.storage.favorites.update(favoriteToBeModified._id, favoriteToBeModified);
                    res.status(200).json({
                        success: true,
                        data: {
                            favorite
                        },
                        message: (0, get_message_1.message)('fav_updated_200', lang)
                    });
                }
            }
            else {
                if (req.body.status) {
                    return next(new appError_1.default(403, 'auth_403'));
                }
            }
        }));
        this.addPostToFavCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { post_id } = req.body;
            const category_id = req.params.category_id;
            const favoriteToBeModified = yield main_1.storage.favorites.findOne({ user_id: id });
            if (favoriteToBeModified) {
                const categoryIndex = favoriteToBeModified.body.findIndex((category) => category._id == category_id);
                const index = favoriteToBeModified.body[categoryIndex].list.indexOf(post_id);
                if (index === -1) {
                    if (post_id && post_id.length > 0) {
                        favoriteToBeModified.body[categoryIndex].list.push(post_id);
                        const favorite = yield main_1.storage.favorites.update(favoriteToBeModified._id, favoriteToBeModified);
                        res.status(200).json({
                            success: true,
                            data: {
                                favorite
                            },
                            message: (0, get_message_1.message)('fav_post_added_200', lang)
                        });
                    }
                    else {
                        return next(new appError_1.default(400, 'no_post_404'));
                    }
                }
                else {
                    res.status(200).json({
                        success: true,
                        message: (0, get_message_1.message)('post_already_in_the_list_400', lang)
                    });
                }
            }
            else {
                if (req.body.status) {
                    return next(new appError_1.default(403, 'auth_403'));
                }
            }
        }));
        this.deletePostFromFavCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { post_id } = req.body;
            const category_id = req.params.category_id;
            const favoriteToBeModified = yield main_1.storage.favorites.findOne({ user_id: id });
            if (favoriteToBeModified) {
                const categoryIndex = favoriteToBeModified.body.findIndex((category) => category._id == category_id);
                const index = favoriteToBeModified.body[categoryIndex].list.indexOf(post_id);
                if (index !== -1) {
                    favoriteToBeModified.body[categoryIndex].list.splice(index, 1);
                    const favorite = yield main_1.storage.favorites.update(favoriteToBeModified._id, favoriteToBeModified);
                    res.status(200).json({
                        success: true,
                        data: {
                            favorite
                        },
                        message: (0, get_message_1.message)('fav_post_deleted_200', lang)
                    });
                }
            }
            else {
                if (req.body.status) {
                    return next(new appError_1.default(403, 'auth_403'));
                }
            }
        }));
    }
}
exports.FavoriteController = FavoriteController;
//# sourceMappingURL=favorite.js.map