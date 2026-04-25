import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerUser,
);
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.post('/verify-otp', AuthController.verifyOTP);
router.post('/resend-otp', AuthController.resendOTP);

export const AuthRoutes = router;
