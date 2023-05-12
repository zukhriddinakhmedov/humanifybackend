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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./routes/index"));
const logger_1 = require("./config/logger");
const error_1 = require("./controllers/error");
const lang_1 = require("./middleware/lang");
const socket_io_1 = require("socket.io");
const cript_1 = require("./controllers/cript");
const main_1 = require("./storage/main");
const app = (0, express_1.default)();
let server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
const controller = new cript_1.CryptController();
// middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, logger_1.expressLogger)());
app.use(lang_1.langMiddleware);
app.use('/v1', index_1.default);
io.on('connection', (socket) => {
    const id = socket.handshake.query.id;
    if (typeof id === 'string') {
        socket.join(id);
    }
    socket.on('send-message', ({ recipients, text, reply_id }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!id)
            return;
        const body = controller.encrypt(text);
        const decrypt = controller.decrypt(body);
        console.log('body: ', body);
        console.log('after body: ', decrypt);
        const new_message = {
            sender_id: id === null || id === void 0 ? void 0 : id.toString(),
            receiver_id: recipients[0],
            body: controller.encrypt(text),
            reply_to: reply_id
        };
        const message = yield main_1.storage.message.create(new_message);
        recipients.forEach((recipient) => {
            const newRecipients = recipients.filter((r) => r !== recipient);
            newRecipients.push(id);
            socket.broadcast.to(recipient).emit('receive-message', message);
        });
    }));
});
app.get('/status', (req, res) => {
    res.json({
        status: 'OK'
    });
});
const errorController = new error_1.ErrorController();
app.use(errorController.handle);
exports.default = server;
//# sourceMappingURL=app.js.map