"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.initiatePayment = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
});
const initiatePayment = async (paymentData) => {
    if (paymentData.gateway === 'stripe') {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(paymentData.amount * 100), // Stripe uses cents
            currency: process.env.STRIPE_CURRENCY || 'usd',
            metadata: {
                rideId: paymentData.rideId,
            },
        });
        return {
            status: 'success',
            transactionId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
        };
    }
    // Fallback for other gateways (e.g. SSLCommerz mock)
    return {
        status: 'success',
        transactionId: `TXN-${Date.now()}`,
        paymentUrl: 'https://payment-gateway.com/pay',
    };
};
exports.initiatePayment = initiatePayment;
const verifyPayment = async (transactionId) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
    return {
        status: paymentIntent.status === 'succeeded' ? 'paid' : 'pending',
        transactionId,
    };
};
exports.verifyPayment = verifyPayment;
