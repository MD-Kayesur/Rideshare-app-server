"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    verificationCode: { type: String, select: false },
    verificationCodeExpires: { type: Date, select: false },
    role: { type: String, enum: ['rider', 'driver', 'admin'], default: 'rider' },
    avatar: { type: String },
    rating: { type: Number, default: 5 },
    isVerified: { type: Boolean, default: false },
    currentLocation: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number] },
    },
}, { timestamps: true, collection: 'auth' });
userSchema.index({ currentLocation: '2dsphere' });
userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    // Only hash the password if it has been modified (or is new)
    if (user.isModified('password')) {
        user.password = await bcryptjs_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    next();
});
exports.User = (0, mongoose_1.model)('User', userSchema);
