import { Types } from 'mongoose';

export type TVehicleType = 'cycle' | 'bike' | 'car' | 'cng';

export type TDriver = {
  user: Types.ObjectId;
  isAvailable: boolean;
  vehicleType: TVehicleType;
  vehicleModel: string;
  vehicleNumber?: string; // Optional for cycle
  vehicleImage?: string;
  licenseNumber?: string; // Optional for cycle
  details?: Record<string, any>; // For dynamic fields like AC/Non-AC for cars
  totalRides: number;
  totalEarnings: number;
  rating: number;
};
