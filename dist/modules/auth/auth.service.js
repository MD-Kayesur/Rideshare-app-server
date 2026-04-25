"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const registerUser = async (payload) => {
    const result = await user_model_1.User.create(payload);
    return result;
};
const loginUser = async (payload) => {
    const user = await user_model_1.User.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordMatched = await bcryptjs_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new Error('Invalid password');
    }
    const accessToken = jsonwebtoken_1.default.sign({ userId: user._id.toString(), role: user.role }, config_1.default.jwt_access_secret, { expiresIn: config_1.default.jwt_access_expires_in });
    return { accessToken, user };
};
exports.AuthService = {
    registerUser,
    loginUser,
};
