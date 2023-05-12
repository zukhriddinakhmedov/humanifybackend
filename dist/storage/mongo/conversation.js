"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationStorage = void 0;
const Conversation_1 = __importDefault(require("../../models/Conversation"));
const logger_1 = require("../../config/logger");
const appError_1 = __importDefault(require("../../utils/appError"));
class ConversationStorage {
    constructor() {
        this.scope = 'storage.conversation';
    }
    findAll(id, postLimit, postPage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbObj = yield Conversation_1.default.aggregate([
                    { $match: { sender_id: id } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "receiver_id",
                            foreignField: "_id",
                            as: "receiver",
                        },
                    },
                    { $skip: postPage },
                    { $limit: postLimit },
                    {
                        $unset: [
                            "receiver.email",
                            "receiver.followers",
                            "receiver.follows",
                            "receiver.interests",
                            "receiver.posts",
                            "receiver.notifications",
                            "receiver.birthday",
                            "receiver.gender",
                            "receiver.password",
                            "receiver.bio",
                            "receiver.createdAt",
                            "receiver.updatedAt",
                            "receiver.__v"
                        ],
                    }
                ]);
                return dbObj;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.find: finished with error: ${error}`);
                throw error;
            }
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield Conversation_1.default.findOne(query);
                return conversation;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.findOne: finished with error: ${error}`);
                throw error;
            }
        });
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newConversation = yield Conversation_1.default.create(payload);
                return newConversation;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.create: finished with error: ${error}`);
                throw error;
            }
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield Conversation_1.default.findOneAndDelete(query);
                if (!conversation) {
                    logger_1.logger.warn(`${this.scope}.delete failed to findOneAndDelete`);
                    throw new appError_1.default(404, 'conversation_404');
                }
                return conversation;
            }
            catch (error) {
                logger_1.logger.error(`${this.scope}.delete: finished with error: ${error}`);
                throw error;
            }
        });
    }
}
exports.ConversationStorage = ConversationStorage;
//# sourceMappingURL=conversation.js.map