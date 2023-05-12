"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const reportSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    owner_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    collection_type: {
        type: String,
        enum: ['users', 'posts', 'comments'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inprogress', 'reviewed'],
        default: 'active'
    },
    report_type: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Report', reportSchema);
//# sourceMappingURL=Report.js.map