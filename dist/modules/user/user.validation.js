"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().optional(),
        role: zod_1.z.enum(['rider', 'driver', 'admin']).optional(),
        avatar: zod_1.z.string().optional(),
        isVerified: zod_1.z.boolean().optional(),
    }),
});
exports.UserValidation = {
    updateUserValidationSchema,
};
