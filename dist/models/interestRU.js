"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const interestRUSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    refId: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('InterestRU', interestRUSchema);
//# sourceMappingURL=interestRU.js.map