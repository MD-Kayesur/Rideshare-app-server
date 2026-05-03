"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverValidation = void 0;
const zod_1 = require("zod");
const createDriverValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        vehicleType: zod_1.z.enum(['cycle', 'bike', 'car', 'cng']),
        vehicleModel: zod_1.z.string().min(1, 'Vehicle model is required'),
        vehicleNumber: zod_1.z.string().optional(),
        vehicleImage: zod_1.z.string().optional(),
        licenseNumber: zod_1.z.string().optional(),
        details: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
const updateDriverValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        isAvailable: zod_1.z.boolean().optional(),
        vehicleType: zod_1.z.enum(['cycle', 'bike', 'car', 'cng']).optional(),
        vehicleModel: zod_1.z.string().optional(),
        vehicleNumber: zod_1.z.string().optional(),
        vehicleImage: zod_1.z.string().optional(),
        licenseNumber: zod_1.z.string().optional(),
        details: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
exports.DriverValidation = {
    createDriverValidationSchema,
    updateDriverValidationSchema,
};
