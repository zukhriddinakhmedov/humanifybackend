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
exports.InfluencerController = void 0;
const main_1 = require("../storage/main");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const get_message_1 = require("../locales/get_message");
const bcrypt_1 = require("bcrypt");
const auth_1 = require("../middleware/auth");
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = require("fs/promises");
const uuid_1 = require("uuid");
const path_1 = require("path");
class InfluencerController {
    constructor() {
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id, role } = res.locals;
            let { postcode } = req.query;
            let search = {};
            if (postcode) {
                search = {
                    postcode: new RegExp(`^${postcode}`, 'i')
                };
            }
            delete req.query.postcode;
            const influencers = yield main_1.storage.influencer.find(Object.assign(Object.assign({}, search), req.query));
            res.status(200).json({
                success: true,
                data: {
                    influencers
                },
                message: (0, get_message_1.message)('influencers_getAll_200', lang)
            });
        }));
        this.getOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const influencer = yield main_1.storage.influencer.findOne({ _id: req.params.id });
            res.status(200).json({
                success: true,
                data: {
                    influencer
                }
            });
        }));
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const salt = yield (0, bcrypt_1.genSalt)();
            req.body.password = yield (0, bcrypt_1.hash)(req.body.password, salt);
            req.body.avatar = '';
            if (req.file) {
                const photo = `avatar/${req.file.fieldname}-${(0, uuid_1.v4)()}.png`;
                yield (0, sharp_1.default)(req.file.buffer).png().toFile((0, path_1.join)(__dirname, '../../uploads', photo));
                req.body.avatar = photo;
            }
            const newInfluencer = yield main_1.storage.influencer.create(req.body);
            const token = yield (0, auth_1.signToken)(newInfluencer.id, req.body.role);
            res.status(201).json({
                success: true,
                data: {
                    newInfluencer,
                    token
                }
            });
        }));
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { old_password, new_password } = req.body;
            const { lang, id } = res.locals;
            const _id = req.params.id;
            console.log('req body: ', req.body);
            let influencer = yield main_1.storage.influencer.findOne({ _id });
            if (new_password && old_password) {
                if (!(yield (0, bcrypt_1.compare)(old_password, influencer.password))) {
                    return next(new appError_1.default(401, 'auth_401'));
                }
                const salt = yield (0, bcrypt_1.genSalt)();
                req.body.password = yield (0, bcrypt_1.hash)(new_password, salt);
            }
            else if (new_password) {
                const salt = yield (0, bcrypt_1.genSalt)();
                req.body.password = yield (0, bcrypt_1.hash)(new_password, salt);
            }
            if (req.file) {
                const photo = `avatar/${req.file.fieldname}-${(0, uuid_1.v4)()}.png`;
                yield (0, sharp_1.default)(req.file.buffer).png().toFile((0, path_1.join)(__dirname, '../../uploads', photo));
                if (influencer.avatar !== '') {
                    yield (0, promises_1.unlink)((0, path_1.join)(__dirname, '../../uploads', influencer.avatar));
                }
                req.body.avatar = photo;
            }
            influencer = yield main_1.storage.influencer.update(_id, req.body);
            res.status(200).json({
                success: true,
                data: {
                    influencer
                },
                message: (0, get_message_1.message)('influencer_updated_200', lang)
            });
        }));
        this.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { login, password } = req.body;
            let influencer = yield main_1.storage.influencer.findOne({ login });
            if (!(yield (0, bcrypt_1.compare)(password, influencer.password))) {
                return next(new appError_1.default(401, 'auth_401'));
            }
            const token = yield (0, auth_1.signToken)(influencer.id, 'influencer');
            res.status(201).json({
                success: true,
                data: {
                    influencer,
                    token
                },
                message: (0, get_message_1.message)('influencer_logged_200', lang)
            });
        }));
        this.delete = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const _id = req.params.id;
            const influencer = yield main_1.storage.influencer.findOne({ _id });
            if (influencer.avatar !== '') {
                yield (0, promises_1.unlink)((0, path_1.join)(__dirname, '../../uploads/avatar', influencer.avatar));
            }
            yield main_1.storage.influencer.delete(req.params.id);
            res.status(200).json({
                success: true,
                data: null,
                message: (0, get_message_1.message)('influencer_delete_204', lang)
            });
        }));
    }
}
exports.InfluencerController = InfluencerController;
//# sourceMappingURL=influencer.js.map