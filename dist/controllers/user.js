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
exports.UserController = void 0;
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
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config/config"));
const form_data_1 = __importDefault(require("form-data"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const SENDGRID_API = config_1.default.SENDGRID_API;
class UserController {
    constructor() {
        this.getAll = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id, role } = res.locals, search = req.query.search;
            delete req.query.search;
            let filter = {};
            let user;
            if (search) {
                filter = Object.assign(Object.assign({}, filter), { $or: [
                        {
                            'first_name': new RegExp(search, 'i')
                        },
                        {
                            'last_name': new RegExp(search, 'i')
                        },
                        {
                            'category': new RegExp(search, 'i')
                        },
                        {
                            'username': new RegExp(search, 'i')
                        }
                    ] });
            }
            else if (req.query) {
                filter = req.query;
            }
            if (role === 'user') {
                user = yield main_1.storage.user.findSearch(Object.assign(Object.assign({}, filter), { status: 'active' }));
            }
            else if (role === 'admin') {
                user = yield main_1.storage.user.findSearch(Object.assign({}, filter));
            }
            res.status(200).json({
                success: true,
                data: {
                    user
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getOne = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id, role } = res.locals;
            const _id = req.params.id;
            const oldFollow = yield main_1.storage.follows.find({ user_id: _id, follower_id: id });
            let follow = 'unfollow';
            if (oldFollow.length) {
                follow = oldFollow[0].status;
            }
            let user;
            if (role === 'user') {
                user = yield main_1.storage.user.findOne({ _id });
            }
            else if (role === 'admin') {
                user = yield main_1.storage.user.findDelete({ _id });
            }
            res.status(200).json({
                success: true,
                data: {
                    user,
                    follow
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getFollowers = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const _id = req.params.id;
            let followers = yield main_1.storage.follows.findPending({ user_id: _id, status: 'active' });
            for (let i = 0; i < followers.result.length; i++) {
                const followBack = yield main_1.storage.follows.find({ user_id: followers.result[i].follower_id, follower_id: id });
                if (followBack.length) {
                    followers.result[i].follow = followBack[0].status;
                }
            }
            res.status(200).json({
                success: true,
                data: {
                    followers
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getFollowings = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const _id = req.params.id;
            let followings;
            if (_id === id) {
                followings = yield main_1.storage.follows.findPending({ follower_id: id, status: 'active' });
                for (let i = 0; i < followings.result.length; i++) {
                    followings.result[i].follow = 'active';
                }
            }
            else {
                followings = yield main_1.storage.follows.findPending({ follower_id: _id, status: 'active' });
                for (let i = 0; i < followings.result.length; i++) {
                    const followBack = yield main_1.storage.follows.find({ user_id: followings.result[i].user_id, follower_id: id });
                    if (followBack.length) {
                        followings.result[i].follow = followBack[0].status;
                    }
                }
            }
            res.status(200).json({
                success: true,
                data: {
                    followings
                },
                message: (0, get_message_1.message)('get_200', lang)
            });
        }));
        this.getPhone = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const form_data = new form_data_1.default();
            const { phone, email, forgotPassword } = req.body;
            let code = Math.floor(Math.random() * 1000000);
            if (code < 100000) {
                code = code + 100000;
            }
            if (phone) {
                const users = yield main_1.storage.user.find({ phone });
                if (users.length && !forgotPassword) {
                    return next(new appError_1.default(403, 'auth_403.2'));
                }
                form_data.append('mobile_phone', `${phone}`);
                form_data.append('message', `Your confirmation code: ${code}`);
                form_data.append('from', '4546');
                yield (0, axios_1.default)({
                    method: 'post',
                    url: 'https://notify.eskiz.uz/api/message/sms/send',
                    headers: Object.assign({ Authorization: config_1.default.SmsToken }, form_data.getHeaders()),
                    data: form_data
                });
                yield main_1.storage.otp.create({ phone, code });
                res.status(201).json({
                    success: true,
                    message: (0, get_message_1.message)('sending_verification_code', lang)
                });
            }
            else if (email) {
                const users = yield main_1.storage.user.find({ email });
                if (users.length && !forgotPassword) {
                    return next(new appError_1.default(403, 'auth_403.2'));
                }
                mail_1.default.setApiKey(SENDGRID_API);
                const msg = {
                    to: email,
                    from: 'handyappuz@gmail.com',
                    subject: 'Verification required',
                    text: `Email check`,
                    html: `<span><b style="color: black; ">Verification code:</b> ${code} <br>
            </span>`,
                };
                mail_1.default
                    .send(msg)
                    .then(() => __awaiter(this, void 0, void 0, function* () {
                    res.status(201).json({
                        success: true,
                        message: (0, get_message_1.message)('sending_verification_code', lang)
                    });
                    yield main_1.storage.otp.create({ email, code });
                }))
                    .catch((error) => {
                    res.status(500).json({
                        status: 'false',
                        message: (0, get_message_1.message)('something_went_wrong!', lang)
                    });
                });
            }
        }));
        this.checkOTP = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { code, phone, email } = req.body;
            if (phone) {
                yield main_1.storage.otp.findOne({ code, phone });
            }
            else {
                yield main_1.storage.otp.findOne({ code, email });
            }
            res.status(201).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.checkUsername = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { username } = req.body;
            const users = yield main_1.storage.user.find({ username });
            if (users.length) {
                res.status(201).json({
                    success: false,
                    message: (0, get_message_1.message)('username_exist', lang)
                });
            }
            else {
                res.status(201).json({
                    success: true,
                    message: (0, get_message_1.message)('otp_200', lang)
                });
            }
        }));
        this.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { email, phone, new_password } = req.body;
            let user;
            if (email) {
                user = yield main_1.storage.user.findOne({ email });
            }
            else if (phone) {
                user = yield main_1.storage.user.findOne({ phone });
            }
            else {
                return next(new appError_1.default(403, 'auth_403.2'));
            }
            const salt = yield (0, bcrypt_1.genSalt)();
            const password = yield (0, bcrypt_1.hash)(new_password, salt);
            yield main_1.storage.user.update(user._id, { password });
            res.status(201).json({
                success: true,
                message: (0, get_message_1.message)('password_changed_200', lang)
            });
        }));
        this.create = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { username, email, phone } = req.body;
            if (username) {
                const user = yield main_1.storage.user.find({ username });
                if (user.length) {
                    return next(new appError_1.default(403, 'auth_403.2'));
                }
            }
            if (email) {
                const user = yield main_1.storage.user.find({ email });
                if (user.length) {
                    return next(new appError_1.default(403, 'auth_403.2'));
                }
            }
            if (phone) {
                const user = yield main_1.storage.user.find({ phone });
                if (user.length) {
                    return next(new appError_1.default(403, 'auth_403.2'));
                }
            }
            const salt = yield (0, bcrypt_1.genSalt)();
            req.body.password = yield (0, bcrypt_1.hash)(req.body.password, salt);
            const user = yield main_1.storage.user.create(req.body);
            const token = yield (0, auth_1.signToken)(user.id, 'user');
            yield main_1.storage.favorites.create({ user_id: user._id });
            res.status(201).json({
                success: true,
                data: {
                    user,
                    token
                },
                message: (0, get_message_1.message)('user_created_200', lang)
            });
        }));
        this.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang } = res.locals;
            const { username, password } = req.body;
            let user;
            const userUsername = yield main_1.storage.user.findLogin({ username });
            const userEmail = yield main_1.storage.user.findLogin({ email: username });
            if (parseInt(username)) {
                const userPhone = yield main_1.storage.user.findLogin({ phone: parseInt(username) });
                user = userPhone[0];
            }
            if (userUsername.length) {
                user = userUsername[0];
            }
            else if (userEmail.length) {
                user = userEmail[0];
            }
            if ((!user) || (!(yield (0, bcrypt_1.compare)(password, user.password)))) {
                return next(new appError_1.default(401, 'auth_401.2'));
            }
            if (user.status !== "active") {
                return next(new appError_1.default(401, 'auth_401.1'));
            }
            const token = yield (0, auth_1.signToken)(user.id, 'user');
            res.status(201).json({
                success: true,
                data: {
                    user,
                    token
                },
                message: (0, get_message_1.message)('user_logged_200', lang)
            });
        }));
        this.update = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { old_password, new_password, status, account_type } = req.body;
            const { lang, id, role } = res.locals;
            const _id = req.params.id;
            if (role === 'user' && ((id !== _id) || status || account_type)) {
                return next(new appError_1.default(401, 'auth_403'));
            }
            const getUser = yield main_1.storage.user.findDelete({ _id });
            if (role === 'user') {
                if (new_password && !old_password) {
                    return next(new appError_1.default(401, 'old_password_401'));
                }
                else if (new_password && old_password) {
                    if (!(yield (0, bcrypt_1.compare)(old_password, getUser.password))) {
                        return next(new appError_1.default(401, 'auth_401'));
                    }
                    const salt = yield (0, bcrypt_1.genSalt)();
                    req.body.password = yield (0, bcrypt_1.hash)(new_password, salt);
                }
            }
            else if (role === 'admin') {
                if (new_password) {
                    const salt = yield (0, bcrypt_1.genSalt)();
                    req.body.password = yield (0, bcrypt_1.hash)(new_password, salt);
                }
            }
            if (req.file) {
                const photo = `userAvatar/${req.file.fieldname}-${(0, uuid_1.v4)()}.png`;
                yield (0, sharp_1.default)(req.file.buffer)
                    .png()
                    .toFile((0, path_1.join)(__dirname, '../../../uploads', photo));
                if (getUser.avatar) {
                    yield (0, promises_1.unlink)((0, path_1.join)(__dirname, '../../../uploads', getUser.avatar));
                }
                req.body.avatar = photo;
            }
            const user = yield main_1.storage.user.update(_id, req.body);
            res.status(200).json({
                success: true,
                data: {
                    user
                },
                message: (0, get_message_1.message)('user_updated_200', lang)
            });
        }));
        this.makeInfluencer = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            req.body.user_id = id;
            yield main_1.storage.makeInfluencer.create(req.body);
            res.status(201).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.follow = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { following } = req.body;
            const toFollow = yield main_1.storage.user.find({ _id: following });
            if (toFollow.length) {
                const oldFollow = yield main_1.storage.follows.find({ user_id: following, follower_id: id });
                if (oldFollow.length) {
                    yield main_1.storage.follows.delete(oldFollow[0]._id);
                    yield main_1.storage.user.update(id, { $inc: { follows: -1 } });
                    yield main_1.storage.user.update(following, { $inc: { followers: -1 } });
                }
                else {
                    if (toFollow[0].type === 'private') {
                        const obj = {
                            user_id: following,
                            status: 'pending',
                            follower_id: id
                        };
                        const obj2 = {
                            receiver_id: following,
                            type: 'waiting_follow',
                            follower_id: id
                        };
                        yield main_1.storage.follows.create(obj);
                        yield main_1.storage.notification.create(obj2);
                        yield main_1.storage.user.update(following, { $inc: { notifications: +1 } });
                    }
                    else {
                        const obj = {
                            user_id: following,
                            status: 'active',
                            follower_id: id
                        };
                        const obj2 = {
                            receiver_id: following,
                            type: 'new_follow',
                            follower_id: id
                        };
                        yield main_1.storage.notification.create(obj2);
                        yield main_1.storage.user.update(following, { $inc: { notifications: +1 } });
                        yield main_1.storage.follows.create(obj);
                        yield main_1.storage.user.update(id, { $inc: { follows: +1 } });
                        yield main_1.storage.user.update(following, { $inc: { followers: +1 } });
                    }
                }
            }
            res.status(201).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.unfollow = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { following } = req.body;
            const follower = yield main_1.storage.user.find({ _id: following });
            if (follower.length) {
                const oldFollow = yield main_1.storage.follows.findOne({ user_id: following, follower_id: id });
                yield main_1.storage.follows.delete(oldFollow._id);
                yield main_1.storage.user.update(following, { $inc: { follows: -1 } });
                yield main_1.storage.user.update(id, { $inc: { followers: -1 } });
            }
            res.status(201).json({
                success: true,
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.updatedPhone = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, id } = res.locals;
            const { code, phone, email } = req.body;
            yield main_1.storage.user.findOne({ _id: id });
            let user;
            if (phone) {
                yield main_1.storage.otp.findOne({ code, phone });
                user = yield main_1.storage.user.update(id, { phone });
            }
            else if (email) {
                yield main_1.storage.otp.findOne({ code, email });
                user = yield main_1.storage.user.update(id, { email });
            }
            else {
                return next(new appError_1.default(403, 'auth_403.2'));
            }
            res.status(201).json({
                success: true,
                data: {
                    user
                },
                message: (0, get_message_1.message)('otp_200', lang)
            });
        }));
        this.delete = (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { lang, role, id } = res.locals;
            const _id = req.params.id;
            const { old_password } = req.body;
            const user = yield main_1.storage.user.findDelete({ _id });
            if (role === 'user' && (id !== _id || !old_password)) {
                return next(new appError_1.default(401, 'auth_403'));
            }
            else if (old_password) {
                if (!(yield (0, bcrypt_1.compare)(old_password, user.password))) {
                    return next(new appError_1.default(401, 'auth_401'));
                }
            }
            else if (role === 'admin') {
                yield main_1.storage.admin.findOne({ _id: id });
            }
            yield main_1.storage.post.updateMany({ owner_id: _id }, { status: 'inactive' });
            const obj = {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                address: user.address,
                follows: user.follows,
                followers: user.followers,
                email: user.email,
                birthday: user.birthday,
                gender: user.gender,
                username: user.username,
                avatar: user.avatar
            };
            yield main_1.storage.deletedUser.create(obj);
            yield main_1.storage.user.delete(req.params.id);
            const favorite = yield main_1.storage.favorites.findOne({ user_id: user._id });
            yield main_1.storage.favorites.delete(favorite._id);
            res.status(200).json({
                success: true,
                message: (0, get_message_1.message)('user_delete_204', lang)
            });
        }));
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map