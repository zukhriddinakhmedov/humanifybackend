"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const postSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    owner_id: {
        type: String,
        ref: 'User',
        required: true
    },
    owner_type: {
        type: String,
        enum: ['user', 'business', 'professional'],
        required: true
    },
    category: {
        type: [String]
    },
    body: {
        type: String
    },
    media: [
        {
            url: {
                type: String
            },
            type: {
                type: String
            }
        }
    ],
    likes: {
        type: [String]
    },
    comments: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    views: {
        type: Number,
        default: 100
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Post', postSchema);
//# sourceMappingURL=Post.js.map