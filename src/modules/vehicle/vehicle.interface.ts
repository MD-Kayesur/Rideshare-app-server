import { Types } from 'mongoose';

export type TVehicleType = 'cycle' | 'bike' | 'car' | 'cng';

export type TVehicle = {
  driver: Types.ObjectId;
  vehicleType: TVehicleType;
  vehicleModel: string;
  vehicleNumber?: string;
  vehicleImage: string;
  licenseNumber?: string;
  details?: Record<string, any>;
  isVerified: boolean;
};
