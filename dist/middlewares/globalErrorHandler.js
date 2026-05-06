"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err?.statusCode || 500;
    let message = err?.message || 'Something went wrong!';
    // Handle Mongoose Duplicate Key Error
    if (err?.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
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
