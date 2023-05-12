"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const messageSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    sender_id: {
        type: String,
        ref: 'User',
        required: true
    },
    receiver_id: {
        type: String,
        ref: 'User',
        required: true
    },
    body: {
        type: Object
    },
    reply_to: {
        type: String
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Message', messageSchema);
//# sourceMappingURL=Message.js.map