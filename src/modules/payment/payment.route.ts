import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-intent', auth('rider'), PaymentController.createPaymentIntent);
router.get('/verify', auth('rider', 'admin'), PaymentController.verifyPayment);
router.get('/my-payments', auth('rider', 'driver', 'admin'), PaymentController.getMyPayments);

export const PaymentRoutes = router;
