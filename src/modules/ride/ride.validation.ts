import { z } from 'zod';

const createRideValidationSchema = z.object({
  body: z.object({
    pickupLocation: z.object({
      coordinates: z.array(z.number()),
      address: z.string(),
    }),
    destinationLocation: z.object({
      coordinates: z.array(z.number()),
      address: z.string(),
    }),
    fare: z.number(),
    distance: z.number(),
    duration: z.number(),
    rideType: z.enum(['bike', 'car', 'cng', 'cycle']),
  }),
});

const updateRideStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'accepted', 'ongoing', 'completed', 'cancelled']),
  }),
});

export const RideValidation = {
  createRideValidationSchema,
  updateRideStatusValidationSchema,
};
