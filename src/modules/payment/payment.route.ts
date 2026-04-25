import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-intent', auth('rider'), PaymentController.createPaymentIntent);
router.get('/verify', auth('rider', 'admin'), PaymentController.verifyPayment);

export const PaymentRoutes = router;
