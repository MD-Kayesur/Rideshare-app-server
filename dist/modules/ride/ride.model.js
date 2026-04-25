"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true },
        address: { type: String, required: true },
    },
    destinationLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true },
        address: { type: String, required: true },
    },
    fare: { type: Number, required: true },
    distance: { type: Number, required: true },
    duration: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    rideType: { type: String, enum: ['bike', 'car'], required: true },
}, { timestamps: true });
rideSchema.index({ pickupLocation: '2dsphere' });
rideSchema.index({ destinationLocation: '2dsphere' });
exports.Ride = (0, mongoose_1.model)('Ride', rideSchema);
