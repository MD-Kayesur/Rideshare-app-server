"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideValidation = void 0;
const zod_1 = require("zod");
const createRideValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        pickupLocation: zod_1.z.object({
            coordinates: zod_1.z.array(zod_1.z.number()),
            address: zod_1.z.string(),
        }),
        destinationLocation: zod_1.z.object({
            coordinates: zod_1.z.array(zod_1.z.number()),
            address: zod_1.z.string(),
        }),
        fare: zod_1.z.number(),
        distance: zod_1.z.number(),
        duration: zod_1.z.number(),
        rideType: zod_1.z.enum(['bike', 'car']),
    }),
});
const updateRideStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'accepted', 'ongoing', 'completed', 'cancelled']),
    }),
});
exports.RideValidation = {
    createRideValidationSchema,
    updateRideStatusValidationSchema,
};
