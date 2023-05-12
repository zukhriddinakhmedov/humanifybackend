"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorController = void 0;
const config_1 = __importDefault(require("../config/config"));
const get_message_1 = require("../locales/get_message");
const { error_messages } = require('../locales/error_messages.json');
class ErrorController {
    constructor() {
        this.sendErrorDev = (err, req, res, next) => {
            let message = err.message;
            if (error_messages.hasOwnProperty(err.message)) {
                message = (0, get_message_1.error_message)(err.message, res.locals.lang);
            }
            return res.status(err.statusCode).json({
                success: false,
                error: err,
                message: message,
                stack: err.stack
            });
        };
        this.sendErrorProd = (err, req, res, next) => {
            // A) Operational, trusted error: send message to client
            if (err.isOperational) {
                return res.status(err.statusCode).json({
                    success: false,
                    message: err.message
                });
            }
            // B) Programming or other unknown error: don't leak error details
            console.error('ERROR 💥', err);
            res.status(500).json({
                success: false,
                message: 'Something went very wrong!'
            });
        };
        this.handle = (err, req, res, next) => {
            err.statusCode = err.statusCode || 500;
            err.status = err.status || 'error';
            if (config_1.default.NodeEnv === 'development') {
                this.sendErrorDev(err, req, res, next);
            }
            else if (config_1.default.NodeEnv === 'production') {
                this.sendErrorProd(err, req, res, next);
            }
        };
    }
}
exports.ErrorController = ErrorController;
//# sourceMappingURL=error.js.map