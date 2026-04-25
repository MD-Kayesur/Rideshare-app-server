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
    password: { type: String, required: true, select: 0 },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['rider', 'driver', 'admin'], default: 'rider' },
    avatar: { type: String },
    rating: { type: Number, default: 5 },
    isVerified: { type: Boolean, default: false },
    currentLocation: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number] },
    },
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    user.password = await bcryptjs_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
    next();
});
exports.User = (0, mongoose_1.model)('User', userSchema);
