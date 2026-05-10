"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = require("mongoose");
const vehicleSchema = new mongoose_1.Schema({
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleType: { type: String, enum: ['cycle', 'bike', 'car', 'cng'], required: true },
    vehicleModel: { type: String, required: true },
    vehicleNumber: { type: String },
    vehicleImage: { type: String, required: true },
    licenseNumber: { type: String },
    details: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    isVerified: { type: Boolean, default: true },
}, { timestamps: true });
exports.Vehicle = (0, mongoose_1.model)('Vehicle', vehicleSchema);
