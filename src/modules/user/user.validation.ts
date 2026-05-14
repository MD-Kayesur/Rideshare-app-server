import { z } from 'zod';

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    phone: z.string().optional(),
    role: z.enum(['rider', 'driver', 'admin']).optional(),
    avatar: z.string().optional(),
    isVerified: z.boolean().optional(),
  }),
});

export const UserValidation = {
  updateUserValidationSchema,
};
