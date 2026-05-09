import { Payment } from './payment.model';
import { initiatePayment, verifyPayment } from './payment.utils';
import { Ride } from '../ride/ride.model';
import { NotificationService } from '../notification/notification.service';

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

  return { 
    paymentUrl: paymentResponse.paymentUrl, 
    transactionId: result.transactionId,
    clientSecret: paymentResponse.clientSecret // Added for Stripe
  };
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
      const updatedRide = await Ride.findByIdAndUpdate(
        result.ride, 
        { paymentStatus: 'paid' },
        { new: true }
      ).populate('rider driver');

      if (updatedRide && updatedRide.driver) {
        const driverId = updatedRide.driver.toString();
        const riderName = (updatedRide.rider as any)?.name || 'A rider';

        // 1. Notify Driver
        await NotificationService.createNotification({
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
        const driverName = (updatedRide.driver as any)?.name || 'Your driver';
        const carName = updatedRide.rideType || 'the car';
        
        await NotificationService.createNotification({
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

const getMyPayments = async (userId: string) => {
  const result = await Payment.find()
    .populate({
      path: 'ride',
      match: { $or: [{ rider: userId }, { driver: userId }] },
    })
    .sort('-createdAt');

  // Filter out payments where the ride didn't match the user (because .populate returns null for non-matching docs)
  return result.filter(payment => payment.ride !== null);
};

export const PaymentService = {
  createPaymentIntent,
  validatePayment,
  getMyPayments,
};
