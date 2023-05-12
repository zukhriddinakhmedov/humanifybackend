"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const Conversationchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    receiver_id: {
        type: String
    },
    sender_id: {
        type: String
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Conversation', Conversationchema);
//# sourceMappingURL=Conversation.js.map