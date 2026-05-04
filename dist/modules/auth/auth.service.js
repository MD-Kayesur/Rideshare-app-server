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
    console.log('registerUser payload:', payload);
    // Generate 5-digit OTP
    const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const result = await user_model_1.User.create({
        ...payload,
        verificationCode,
        verificationCodeExpires,
    });
    console.log({ ...result.toObject(), verificationCode }, 'result service');
    // Send the code via Email (wrapped in try-catch to avoid failing registration if email service is not configured)
    try {
        await (0, sendEmail_1.sendEmail)(payload.email, 'Verify your account', `<h1>Verification Code</h1><p>Your code is <strong>${verificationCode}</strong>. It expires in 10 minutes.</p>`);
    }
    catch (error) {
        console.error('Email sending failed, but user was created:', error);
    }
    return {
        user: result,
        verificationCode, // Added for practice purpose
    };
};
const verifyOTP = async (payload) => {
    const user = await user_model_1.User.findOne({
        email: payload.email,
        verificationCode: payload.code,
        verificationCodeExpires: { $gt: new Date() },
    });
    console.log(user, 'user');
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
    console.log({ ...user.toObject(), verificationCode }, 'result service');
    // Send the code via Email
    try {
        await (0, sendEmail_1.sendEmail)(email, 'Resend Verification Code', `<h1>Verification Code</h1><p>Your new code is <strong>${verificationCode}</strong>. It expires in 10 minutes.</p>`);
    }
    catch (error) {
        console.error('Email resending failed:', error);
    }
    return {
        message: 'Verification code resent successfully',
        verificationCode, // Added for practice purpose
    };
};
const loginUser = async (payload) => {
    console.log('loginUser payload:', payload);
    // Hard-coded Admin Check
    if (payload.email === 'rmdkayesur@gmail.com' && payload.password === 'rmdkayesur') {
        let adminUser = await user_model_1.User.findOne({ email: payload.email });
        if (!adminUser) {
            // Create admin user if it doesn't exist
            adminUser = await user_model_1.User.create({
                name: 'Admin',
                email: payload.email,
                password: payload.password, // Will be hashed by pre-save hook
                phone: '00000000000',
                role: 'admin',
                isVerified: true
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: adminUser._id.toString(), role: 'admin' }, config_1.default.jwt_access_secret, { expiresIn: config_1.default.jwt_access_expires_in });
        return { accessToken, user: adminUser };
    }
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
    verifyOTP,
    resendOTP,
    loginUser,
};
