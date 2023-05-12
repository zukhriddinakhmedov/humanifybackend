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
exports.AdminController = void 0;
const main_1 = require("../storage/main");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const get_message_1 = require("../locales/get_message");
const bcrypt_1 = require("bcrypt");
const auth_1 = require("../middleware/auth");
const uuid_1 = require("uuid");
const path_1 = require("path");
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = require("fs/promises");
class AdminController {
    constructor() {
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const admin = yield main_1.storage.admin.findSuperAdmin({ _id: id, status: "active" });
            if (admin.role !== 'superadmin') {
                return next(new appError_1.default(403, 'auth_403'));
            }
            const admins = yield main_1.storage.admin.find(req.query);
            res.status(200).json({
                success: true,
                data: {
                    admins
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const _id = req.params.id;
            let admin = yield main_1.storage.admin.findSuperAdmin({ _id: id, status: "active" });
            if (admin.role === 'admin' && id !== _id) {
                return next(new appError_1.default(403, 'auth_403'));
            }
            admin = yield main_1.storage.admin.findOne({ _id });
            res.status(200).json({
                success: true,
                data: {
                    admin
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getAllMakeInfluencers = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const becomeInfluencers = yield main_1.storage.makeInfluencer.find(req.query);
            res.status(200).json({
                success: true,
                data: {
                    becomeInfluencers
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            let admin = yield main_1.storage.admin.findSuperAdmin({ _id: id });
            if (admin.role !== 'superadmin') {
                return next(new appError_1.default(403, 'auth_403'));
            }
            const salt = yield (0, bcrypt_1.genSalt)();
            req.body.password = yield (0, bcrypt_1.hash)(req.body.password, salt);
            req.body.role = 'admin';
            admin = yield main_1.storage.admin.create(req.body);
            res.status(201).json({
                success: true,
                data: {
                    admin
                },
                message: (0, get_message_1.message)('admin_created_200', lang)
            });
        }));
        this.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { login, password } = req.body;
            let admin;
            const adminLogin = yield main_1.storage.admin.findLogin({ login });
            if (!adminLogin.length) {
                const adminEmail = yield main_1.storage.admin.findLogin({ email: login });
                admin = adminEmail[0];
            }
            else {
                admin = adminLogin[0];
            }
            if ((!admin) || (!(yield (0, bcrypt_1.compare)(password, admin.password)))) {
                return next(new appError_1.default(401, 'auth_401.2'));
            }
            if (admin.status !== "active") {
                return next(new appError_1.default(401, 'auth_401.1'));
            }
            const token = yield (0, auth_1.signToken)(admin.id, 'admin');
            res.status(201).json({
                success: true,
                data: {
                    admin,
                    token
                },
                message: (0, get_message_1.message)('admin_logged_200', lang)
            });
        }));
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { old_password, new_password, status } = req.body;
            const { lang, id } = res.locals;
            const _id = req.params.id;
            let admin = yield main_1.storage.admin.findSuperAdmin({ _id: id, status: "active" });
            if ((admin.role === 'admin') && ((id !== _id) || status)) {
                return next(new appError_1.default(403, 'auth_403'));
            }
            if (admin.role === 'admin' && new_password && !old_password) {
                return next(new appError_1.default(401, 'old_password_401'));
            }
            if (new_password && old_password) {
                if (!(yield (0, bcrypt_1.compare)(old_password, admin.password))) {
                    return next(new appError_1.default(401, 'auth_401'));
                }
                const salt = yield (0, bcrypt_1.genSalt)();
                req.body.password = yield (0, bcrypt_1.hash)(new_password, salt);
            }
            else if (admin.role === 'superadmin') {
                admin = yield main_1.storage.admin.findOne({ _id });
                if (new_password) {
                    const salt = yield (0, bcrypt_1.genSalt)();
                    req.body.password = yield (0, bcrypt_1.hash)(new_password, salt);
                }
            }
            if (req.file) {
                const photo = `adminAvatar/${req.file.fieldname}-${(0, uuid_1.v4)()}.png`;
                yield (0, sharp_1.default)(req.file.buffer)
                    .png()
                    .toFile((0, path_1.join)(__dirname, '../../../uploads', photo));
                if (admin.avatar) {
                    yield (0, promises_1.unlink)((0, path_1.join)(__dirname, '../../../uploads', admin.avatar));
                }
                req.body.avatar = photo;
            }
            admin = yield main_1.storage.admin.update({ _id }, req.body);
            res.status(200).json({
                success: true,
                data: {
                    admin
                },
                message: (0, get_message_1.message)('admin_updated_200', lang)
            });
        }));
        this.delete = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id, lang } = res.locals;
            const _id = req.params.id;
            yield main_1.storage.admin.findSuperAdmin({ _id: id, role: "superadmin", status: "active" });
            const admin = yield main_1.storage.admin.findOne({ _id });
            if (admin.avatar) {
                yield (0, promises_1.unlink)((0, path_1.join)(__dirname, '../../../uploads', admin.avatar));
            }
            yield main_1.storage.admin.delete({ _id });
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('admin_delete_200', lang)
            });
        }));
        this.createInfluencer = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { response, user_id, account_type } = req.body;
            if (response) {
                yield main_1.storage.user.update(user_id, { account_type, type: 'public' });
                yield main_1.storage.post.updateMany({ owner_id: user_id }, { owner_type: account_type });
            }
            res.status(201).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.createSuperAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { password } = req.body;
            const salt = yield (0, bcrypt_1.genSalt)();
            const hashed_password = yield (0, bcrypt_1.hash)(password, salt);
            const admin = yield main_1.storage.admin.create(Object.assign(Object.assign({}, req.body), { password: hashed_password, role: 'superadmin' }));
            const token = yield (0, auth_1.signToken)(admin.id, 'admin');
            res.status(201).json({
                success: true,
                data: {
                    admin,
                    token
                }
            });
        }));
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.js.map