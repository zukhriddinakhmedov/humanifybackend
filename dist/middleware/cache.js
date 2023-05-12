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
exports.clear = exports.get = exports.set = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const cache = new node_cache_1.default();
const set = () => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { role, id } = res.locals;
        let result = `${req.originalUrl}-${role}-${id}`;
        const data = JSON.stringify(res.locals.data);
        if (result && data) {
            cache.set(result, data);
            return next();
        }
    }));
};
exports.set = set;
const get = () => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { role, id } = res.locals;
        let result = `${req.originalUrl}-${role}-${id}`;
        if (result) {
            const content = cache.get(result);
            if (content) {
                const data = JSON.parse(content);
                if (data) {
                    return res.status(200).send(data);
                }
            }
            return next();
        }
    }));
};
exports.get = get;
const clear = () => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const keys = cache.keys(), url = `/v1/`;
        if (keys.length > 0) {
            cache.del(keys.filter((k) => k.startsWith(url)));
            return next();
        }
    }));
};
exports.clear = clear;
//# sourceMappingURL=cache.js.map