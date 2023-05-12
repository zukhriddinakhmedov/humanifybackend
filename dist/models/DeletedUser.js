"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const deletedUserSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String
    },
    avatar: {
        type: String
    },
    birthday: {
        type: String
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
        enum: ['Male', 'Female']
    },
    followers: {
        type: Number
    },
    follows: {
        type: Number
    },
    interests: {
        type: [String]
    },
    username: {
        type: String
    },
    phone: {
        type: Number
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('DeletedUser', deletedUserSchema);
//# sourceMappingURL=DeletedUser.js.map