"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_model_1 = require("./payment.model");
const payment_utils_1 = require("./payment.utils");
const ride_model_1 = require("../ride/ride.model");
const notification_service_1 = require("../notification/notification.service");
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
    return {
        paymentUrl: paymentResponse.paymentUrl,
        transactionId: result.transactionId,
        clientSecret: paymentResponse.clientSecret // Added for Stripe
    };
};
const validatePayment = async (transactionId) => {
    const verificationResponse = await (0, payment_utils_1.verifyPayment)(transactionId);
    if (verificationResponse.status === 'paid') {
        const result = await payment_model_1.Payment.findOneAndUpdate({ transactionId }, { status: 'paid' }, { new: true });
        if (result) {
            const updatedRide = await ride_model_1.Ride.findByIdAndUpdate(result.ride, { paymentStatus: 'paid' }, { new: true }).populate('rider driver');
            if (updatedRide && updatedRide.driver) {
                const driverId = updatedRide.driver.toString();
                const riderName = updatedRide.rider?.name || 'A rider';
                // 1. Notify Driver
                await notification_service_1.NotificationService.createNotification({
                    recipient: driverId,
                    title: 'Payment Received',
                    message: `${riderName} has successfully paid. Service him now.`,
                    type: 'payment',
                    metadata: {
                        rideId: updatedRide._id,
                        amount: result.amount,
                        transactionId: result.transactionId,
                        riderName: riderName
                    }
                });
                // 2. Notify Rider
                const driverName = updatedRide.driver?.name || 'Your driver';
                const carName = updatedRide.rideType || 'the car';
                await notification_service_1.NotificationService.createNotification({
                    recipient: updatedRide.rider._id.toString(),
                    title: 'Payment Successful',
                    message: `Payment successful! Wait for ${carName} and ${driverName}.`,
                    type: 'payment',
                    metadata: {
                        rideId: updatedRide._id,
                        driverName: driverName,
                        carName: carName
                    }
                });
            }
        }
        return result;
    }
    return null;
};
const getMyPayments = async (userId) => {
    const result = await payment_model_1.Payment.find()
        .populate({
        path: 'ride',
        match: { $or: [{ rider: userId }, { driver: userId }] },
    })
        .sort('-createdAt');
    // Filter out payments where the ride didn't match the user (because .populate returns null for non-matching docs)
    return result.filter(payment => payment.ride !== null);
};
exports.PaymentService = {
    createPaymentIntent,
    validatePayment,
    getMyPayments,
};
