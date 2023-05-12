"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const makeInfluencerSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    influencer_type: {
        type: String,
        enum: ['business', 'professional'],
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('makeInfluencer', makeInfluencerSchema);
//# sourceMappingURL=MakeInfluencer.js.map