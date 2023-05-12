"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const notificationSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    receiver_id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['new_follow', 'waiting_follow', 'comment', 'like', 'message'],
        required: true
    },
    follower_id: {
        type: String,
        ref: 'User'
    },
    post_id: {
        type: String,
        ref: 'Post'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
notificationSchema.index({ created_at: 1 }, { expireAfterSeconds: 259200 });
exports.default = (0, mongoose_1.model)('Notification', notificationSchema);
//# sourceMappingURL=Notification.js.map