"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../config/logger");
const config_1 = __importDefault(require("../config/config"));
const db = mongoose_1.default.connection;
db.on('error', () => {
    logger_1.logger.error('DB: mongo db connection is not open');
    logger_1.logger.info('DB: killing myself so that container restarts');
});
db.once('open', () => {
    logger_1.logger.info('DB: mongo db connection is established');
});
class Database {
    constructor() {
        // url = `mongodb://localhost:${config.MongoPort}/${config.MongoDatabase}`
        this.url = `mongodb+srv://${config_1.default.MongoDatabase}:${config_1.default.MongoPassword}@cluster0.hszrnmm.mongodb.net/?retryWrites=true&w=majority`;
        logger_1.logger.info(`DB: DATABASE URL: ${this.url}`);
    }
    connect() {
        return mongoose_1.default.connect(this.url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        }, (error) => {
            if (error) {
                logger_1.logger.error('DB: MongoDB Connection error:', error);
                process.exit(1);
            }
        });
    }
}
exports.default = Database;
//# sourceMappingURL=db.js.map