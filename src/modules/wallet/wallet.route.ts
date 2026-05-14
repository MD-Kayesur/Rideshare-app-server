import express from 'express';
import auth from '../../middlewares/auth';
import { WalletController } from './wallet.controller';

const router = express.Router();

router.post(
  '/add-money',
  auth('rider', 'driver', 'admin'),
  WalletController.addMoney,
);

router.get(
  '/my-wallet',
  auth('rider', 'driver', 'admin'),
  WalletController.getMyWallet,
);

export const WalletRoutes = router;
