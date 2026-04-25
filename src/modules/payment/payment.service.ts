import { Payment } from './payment.model';
import { initiatePayment, verifyPayment } from './payment.utils';
import { Ride } from '../ride/ride.model';

const createPaymentIntent = async (rideId: string, gateway: 'stripe' | 'sslcommerz') => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new Error('Ride not found');
  }

  const paymentResponse = await initiatePayment({
    amount: ride.fare,
    rideId,
    gateway,
  });

  const result = await Payment.create({
    transactionId: paymentResponse.transactionId,
    ride: rideId,
    amount: ride.fare,
    paymentGateway: gateway,
    status: 'pending',
  });

  return { paymentUrl: paymentResponse.paymentUrl, transactionId: result.transactionId };
};

const validatePayment = async (transactionId: string) => {
  const verificationResponse = await verifyPayment(transactionId);
  
  if (verificationResponse.status === 'paid') {
    const result = await Payment.findOneAndUpdate(
      { transactionId },
      { status: 'paid' },
      { new: true },
    );

    if (result) {
      await Ride.findByIdAndUpdate(result.ride, { paymentStatus: 'paid' });
    }
    
    return result;
  }

  return null;
};

export const PaymentService = {
  createPaymentIntent,
  validatePayment,
};
