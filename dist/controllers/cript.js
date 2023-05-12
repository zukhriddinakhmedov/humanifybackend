"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptController = void 0;
const crypto_1 = __importDefault(require("crypto"));
class CryptController {
    constructor() {
        this.algorithm = 'aes-256-ctr';
        this.secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
        this.encrypt = (text) => {
            const iv = crypto_1.default.randomBytes(16);
            const cipher = crypto_1.default.createCipheriv(this.algorithm, this.secretKey, iv);
            const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
            return {
                iv: iv.toString('hex'),
                content: encrypted.toString('hex')
            };
        };
        this.decrypt = (hash) => {
            const decipher = crypto_1.default.createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, 'hex'));
            const decrpyted = Buffer.concat([
                decipher.update(Buffer.from(hash.content, 'hex')),
                decipher.final()
            ]);
            return decrpyted.toString();
        };
    }
}
exports.CryptController = CryptController;
//# sourceMappingURL=cript.js.map