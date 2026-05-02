"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driverSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    isAvailable: { type: Boolean, default: true },
    vehicleType: { type: String, enum: ['cycle', 'bike', 'car', 'cng'], required: true },
    vehicleModel: { type: String, required: true },
    vehicleNumber: { type: String },
    vehicleImage: { type: String },
    licenseNumber: { type: String },
    details: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    isVerified: { type: Boolean, default: false }, // New field for admin verification
    totalRides: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
}, { timestamps: true });
exports.Driver = (0, mongoose_1.model)('Driver', driverSchema);
