"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const followsSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    follower_id: {
        type: String,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'pending'],
        required: true
    },
    follow: {
        type: String,
        default: 'unfollow'
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Follows', followsSchema);
//# sourceMappingURL=Follows.js.map