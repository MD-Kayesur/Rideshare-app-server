"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const user_model_1 = require("../modules/user/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const token = req.headers.authorization;
        // checking if the token is missing
        if (!token) {
            throw new AppError_1.default(401, 'You are not authorized!');
        }
        // checking if the given token is valid
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { role, userId, iat } = decoded;
        // checking if the user is exist
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            console.log('User not found for ID:', userId);
            throw new AppError_1.default(404, `User not found for ID: ${userId}. Please login again.`);
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(401, 'You are not authorized !');
        }
        req.user = decoded;
        next();
    });
};
exports.default = auth;
