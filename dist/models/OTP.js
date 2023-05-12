"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const OTPSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    phone: {
        type: Number
    },
    email: {
        type: String
    },
    code: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
OTPSchema.index({ created_at: 1 }, { expireAfterSeconds: 180 });
exports.default = (0, mongoose_1.model)('otpes', OTPSchema);
//# sourceMappingURL=OTP.js.map