"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    transactionId: { type: String, required: true, unique: true },
    ride: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Ride', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'BDT' },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    paymentGateway: {
        type: String,
        enum: ['stripe', 'sslcommerz'],
        required: true,
    },
    paymentData: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
