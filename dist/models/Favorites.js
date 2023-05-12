"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const favoritesSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    user_id: {
        type: String,
        required: true
    },
    body: {
        type: [{
                name: {
                    type: String,
                    unique: true
                },
                image: {
                    type: String
                },
                list: [String]
            }],
        default: []
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Favorites', favoritesSchema);
//# sourceMappingURL=Favorites.js.map