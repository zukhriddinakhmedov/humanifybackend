"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const interestUZSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    refId: {
        type: String
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    media: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('InterestUZ', interestUZSchema);
//# sourceMappingURL=InterestUZ.js.map