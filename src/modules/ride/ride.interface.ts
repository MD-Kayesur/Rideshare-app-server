import { Types } from 'mongoose';

export type TRideStatus = 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';

export type TRide = {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: {
    type: 'Point';
    coordinates: number[];
    address: string;
  };
  destinationLocation: {
    type: 'Point';
    coordinates: number[];
    address: string;
  };
  fare: number;
  distance: number;
  duration: number;
  status: TRideStatus;
  paymentStatus: 'pending' | 'paid';
  paymentMethod: 'cash' | 'card';
  rideType: 'bike' | 'car' | 'cng' | 'cycle';
  riderRating?: number;
  driverRating?: number;
  otp?: string;
};
