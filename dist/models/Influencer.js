"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const influencerSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    },
    birthday: {
        type: String,
        required: true
    },
    address: {
        country: {
            type: String
        },
        city: {
            type: String
        },
        home: {
            type: String
        },
        postcode: {
            type: String
        }
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    followers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    follows: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    login: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Influencer', influencerSchema);
//# sourceMappingURL=Influencer.js.map