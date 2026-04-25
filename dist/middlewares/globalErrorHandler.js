"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong!';
    // Simplify error structure for this example
    return res.status(statusCode).json({
        success: false,
        message,
        errorSources: [
            {
                path: '',
                message: err?.message || 'Unknown error',
            },
        ],
        stack: config_1.default.NODE_ENV === 'development' ? err?.stack : null,
    });
};
exports.default = globalErrorHandler;
