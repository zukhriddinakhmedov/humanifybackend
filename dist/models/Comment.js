"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const commentSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    reply_id: {
        type: String,
        ref: 'Comment',
    },
    post_id: {
        type: String,
        required: true
    },
    owner_id: {
        type: String,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    likes: {
        type: [String],
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Comment', commentSchema);
//# sourceMappingURL=Comment.js.map