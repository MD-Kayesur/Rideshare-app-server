import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia' as any,
});

export const initiatePayment = async (paymentData: { amount: number; rideId: string; gateway: string }) => {
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

export const verifyPayment = async (transactionId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
  
  return {
    status: paymentIntent.status === 'succeeded' ? 'paid' : 'pending',
    transactionId,
  };
};
