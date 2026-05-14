import express from 'express';
import auth from '../../middlewares/auth';
import { WalletController } from './wallet.controller';

const router = express.Router();

router.post(
  '/add-money',
  auth('rider', 'driver', 'admin'),
  WalletController.addMoney,
);

router.post(
  '/withdraw-money',
  auth('rider', 'driver', 'admin'),
  WalletController.withdrawMoney,
);

router.get(
  '/my-wallet',
  auth('rider', 'driver', 'admin'),
  WalletController.getMyWallet,
);

router.delete(
  '/delete/:id',
  auth('rider', 'driver', 'admin'),
  WalletController.deleteTransaction,
);

router.delete(
  '/delete-all',
  auth('rider', 'driver', 'admin'),
  WalletController.deleteAllTransactions,
);

export const WalletRoutes = router;
