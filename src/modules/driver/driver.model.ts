import { Schema, model } from 'mongoose';
import { TDriver } from './driver.interface';

const driverSchema = new Schema<TDriver>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    isAvailable: { type: Boolean, default: true },
    vehicleType: { type: String, enum: ['cycle', 'bike', 'car', 'cng'], required: true },
    vehicleModel: { type: String, required: true },
    vehicleNumber: { type: String },
    vehicleImage: { type: String },
    licenseNumber: { type: String },
    details: { type: Schema.Types.Mixed, default: {} },
    isVerified: { type: Boolean, default: false }, // New field for admin verification
    totalRides: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    driverBio: { type: String },
    driverPhoto: { type: String },
  },
  { timestamps: true },
);

export const Driver = model<TDriver>('Driver', driverSchema);
