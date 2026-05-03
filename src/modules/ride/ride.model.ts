import { Schema, model } from 'mongoose';
import { TRide } from './ride.interface';

const rideSchema = new Schema<TRide>(
  {
    rider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
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
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
    rideType: { type: String, enum: ['bike', 'car', 'cng', 'cycle'], required: true },
    riderRating: { type: Number },
    driverRating: { type: Number },
    otp: { type: String },
  },
  { timestamps: true },
);

rideSchema.index({ pickupLocation: '2dsphere' });
rideSchema.index({ destinationLocation: '2dsphere' });

export const Ride = model<TRide>('Ride', rideSchema);
