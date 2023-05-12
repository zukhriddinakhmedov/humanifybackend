"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_message = exports.message = void 0;
let { messages } = require('./messages.json');
let { error_messages } = require('./error_messages.json');
function message(message, lang) {
    if (messages.hasOwnProperty(message)) {
        return messages[message][lang];
    }
    return message;
}
exports.message = message;
function error_message(message, lang) {
    return error_messages[message][lang] || message;
}
exports.error_message = error_message;
//# sourceMappingURL=get_message.js.map