import { Schema, model } from 'mongoose';
import { TVehicle } from './vehicle.interface';

const vehicleSchema = new Schema<TVehicle>(
  {
    driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleType: { type: String, enum: ['cycle', 'bike', 'car', 'cng'], required: true },
    vehicleModel: { type: String, required: true },
    vehicleNumber: { type: String },
    vehicleImage: { type: String, required: true },
    licenseNumber: { type: String },
    details: { type: Schema.Types.Mixed, default: {} },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Vehicle = model<TVehicle>('Vehicle', vehicleSchema);
