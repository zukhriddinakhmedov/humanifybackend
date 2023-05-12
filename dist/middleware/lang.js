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
Object.defineProperty(exports, "__esModule", { value: true });
exports.langMiddleware = void 0;
const langMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const languages = {
        en: 'en',
        ru: 'ru',
        uz: 'uz'
    };
    let { lang } = req.headers;
    if (!lang || !languages[lang]) {
        lang = 'uz';
    }
    res.locals.lang = lang;
    next();
});
exports.langMiddleware = langMiddleware;
//# sourceMappingURL=lang.js.map