"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const deletedPostSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    owner_id: {
        type: String,
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
        type: Number
    },
    views: {
        type: Number,
        default: 100
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('DeletedPost', deletedPostSchema);
//# sourceMappingURL=DeletedPost.js.map