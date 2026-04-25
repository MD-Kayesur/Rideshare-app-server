"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_model_1 = require("./payment.model");
const payment_utils_1 = require("./payment.utils");
const ride_model_1 = require("../ride/ride.model");
const createPaymentIntent = async (rideId, gateway) => {
    const ride = await ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new Error('Ride not found');
    }
    const paymentResponse = await (0, payment_utils_1.initiatePayment)({
        amount: ride.fare,
        rideId,
        gateway,
    });
    const result = await payment_model_1.Payment.create({
        transactionId: paymentResponse.transactionId,
        ride: rideId,
        amount: ride.fare,
        paymentGateway: gateway,
        status: 'pending',
    });
    return { paymentUrl: paymentResponse.paymentUrl, transactionId: result.transactionId };
};
const validatePayment = async (transactionId) => {
    const verificationResponse = await (0, payment_utils_1.verifyPayment)(transactionId);
    if (verificationResponse.status === 'paid') {
        const result = await payment_model_1.Payment.findOneAndUpdate({ transactionId }, { status: 'paid' }, { new: true });
        if (result) {
            await ride_model_1.Ride.findByIdAndUpdate(result.ride, { paymentStatus: 'paid' });
        }
        return result;
    }
    return null;
};
exports.PaymentService = {
    createPaymentIntent,
    validatePayment,
};
