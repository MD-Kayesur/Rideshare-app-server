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
const sendEmail_1 = require("../../utils/sendEmail");
const registerUser = async (payload) => {
    // Generate 5-digit OTP
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const result = await user_model_1.User.create({
        ...payload,
        verificationCode,
        verificationCodeExpires,
    });
    // Send the code via Email
    await (0, sendEmail_1.sendEmail)(payload.email, 'Verify your account', `<h1>Verification Code</h1><p>Your code is <strong>${verificationCode}</strong>. It expires in 10 minutes.</p>`);
    return result;
};
const verifyOTP = async (payload) => {
    const user = await user_model_1.User.findOne({
        email: payload.email,
        verificationCode: payload.code,
        verificationCodeExpires: { $gt: new Date() },
    });
    if (!user) {
        throw new Error('Invalid or expired verification code');
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    return user;
};
const resendOTP = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();
    // Send the code via Email
    await (0, sendEmail_1.sendEmail)(email, 'Resend Verification Code', `<h1>Verification Code</h1><p>Your new code is <strong>${verificationCode}</strong>. It expires in 10 minutes.</p>`);
    return { message: 'Verification code resent successfully' };
};
const loginUser = async (payload) => {
    const user = await user_model_1.User.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new Error('User not found');
    }
    // If we want to enforce verification before login
    // if (!user.isVerified) {
    //   throw new Error('Please verify your phone number first');
    // }
    const isPasswordMatched = await bcryptjs_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new Error('Invalid password');
    }
    const accessToken = jsonwebtoken_1.default.sign({ userId: user._id.toString(), role: user.role }, config_1.default.jwt_access_secret, { expiresIn: config_1.default.jwt_access_expires_in });
    return { accessToken, user };
};
exports.AuthService = {
    registerUser,
    verifyOTP,
    resendOTP,
    loginUser,
};
