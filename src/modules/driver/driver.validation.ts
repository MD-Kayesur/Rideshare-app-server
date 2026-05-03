import { z } from 'zod';

const createDriverValidationSchema = z.object({
  body: z.object({
    vehicleType: z.enum(['cycle', 'bike', 'car', 'cng']),
    vehicleModel: z.string().min(1, 'Vehicle model is required'),
    vehicleNumber: z.string().optional(),
    vehicleImage: z.string().optional(),
    licenseNumber: z.string().optional(),
    details: z.record(z.any()).optional(),
  }),
});

const updateDriverValidationSchema = z.object({
  body: z.object({
    isAvailable: z.boolean().optional(),
    vehicleType: z.enum(['cycle', 'bike', 'car', 'cng']).optional(),
    vehicleModel: z.string().optional(),
    vehicleNumber: z.string().optional(),
    vehicleImage: z.string().optional(),
    licenseNumber: z.string().optional(),
    details: z.record(z.any()).optional(),
  }),
});

export const DriverValidation = {
  createDriverValidationSchema,
  updateDriverValidationSchema,
};
