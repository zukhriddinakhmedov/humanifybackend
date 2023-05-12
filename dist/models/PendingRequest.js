"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const pendingRequestSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    receiver_id: {
        type: String,
        required: true
    },
    follower_id: {
        type: String,
        ref: 'User'
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('PendingRequest', pendingRequestSchema);
//# sourceMappingURL=PendingRequest.js.map