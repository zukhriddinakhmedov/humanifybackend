"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const message_1 = require("./mongo/message");
const admin_1 = require("./mongo/admin");
const user_1 = require("./mongo/user");
const otp_1 = require("./mongo/otp");
const deletedUser_1 = require("./mongo/deletedUser");
const deletedPost_1 = require("./mongo/deletedPost");
const interestUz_1 = require("./mongo/interestUz");
const interestRU_1 = require("./mongo/interestRU");
const post_1 = require("./mongo/post");
const notification_1 = require("./mongo/notification");
const follows_1 = require("./mongo/follows");
const favorites_1 = require("./mongo/favorites");
const makeInfluencer_1 = require("./mongo/makeInfluencer");
const comment_1 = require("./mongo/comment");
const report_1 = require("./mongo/report");
const conversation_1 = require("./mongo/conversation");
exports.storage = {
    admin: new admin_1.AdminStorage(),
    user: new user_1.UserStorage(),
    otp: new otp_1.OTPStorage(),
    deletedUser: new deletedUser_1.DeletedUserStorage(),
    deletedPost: new deletedPost_1.DeletedPostStorage(),
    interestUZ: new interestUz_1.InterestUZStorage(),
    interestRU: new interestRU_1.InterestRUStorage(),
    post: new post_1.PostStorage(),
    notification: new notification_1.NotificationStorage(),
    follows: new follows_1.FollowsStorage(),
    favorites: new favorites_1.FavoritesStorage(),
    makeInfluencer: new makeInfluencer_1.MakeInfluencerStorage(),
    comment: new comment_1.CommentStorage(),
    report: new report_1.ReportStorage(),
    message: new message_1.MessageStorage(),
    conversation: new conversation_1.ConversationStorage()
};
//# sourceMappingURL=main.js.map