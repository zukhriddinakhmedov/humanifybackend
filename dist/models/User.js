"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const userSchema = new mongoose_1.Schema({
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
        type: String
    },
    avatar: {
        type: String
    },
    birthday: {
        type: String,
        required: true
    },
    address: {
        long: {
            type: Number
        },
        lat: {
            type: Number
        }
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    followers: {
        type: Number,
        default: 0
    },
    follows: {
        type: Number,
        default: 0
    },
    interests: [{
            type: String,
            default: []
        }],
    posts: {
        type: Number,
        default: 0
    },
    notifications: {
        type: Number,
        default: 0
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String
    },
    category: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    type: {
        type: String,
        enum: ['private', 'public'],
        required: true
    },
    account_type: {
        type: String,
        enum: ['user', 'business', 'profesional'],
        default: 'user'
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map