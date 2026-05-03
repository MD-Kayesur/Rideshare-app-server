import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(4),
    newPassword: z.string().min(4),
  }),
});

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    phone: z.string().min(1, 'Phone number is required'),
    gender: z.enum(['Male', 'Female', 'Other']),
    role: z.enum(['rider', 'driver', 'admin']).optional(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  registerValidationSchema,
  changePasswordValidationSchema,
};
