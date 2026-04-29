"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(4, 'Password must be at least 4 characters'),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string().min(4),
        newPassword: zod_1.z.string().min(4),
    }),
});
const registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(4, 'Password must be at least 4 characters'),
        phone: zod_1.z.string().min(1, 'Phone number is required'),
        gender: zod_1.z.enum(['Male', 'Female', 'Other']),
        role: zod_1.z.enum(['rider', 'driver', 'admin']).optional(),
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
    registerValidationSchema,
    changePasswordValidationSchema,
};
