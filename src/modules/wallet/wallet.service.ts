import { Wallet, Transaction } from './wallet.model';
import { TTransaction } from './wallet.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const addMoneyToWallet = async (userId: string, payload: Partial<TTransaction>) => {
  const { amount } = payload;
  
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid amount');
  }

  // 1. Update or create wallet
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId, balance: amount });
  } else {
    wallet.balance += amount;
    await wallet.save();
  }

  // 2. Create transaction record
  const transaction = await Transaction.create({
    user: userId,
    amount,
    type: 'in',
    status: 'completed',
    paymentGateway: payload.paymentGateway || 'stripe',
    paymentMethod: payload.paymentMethod,
    transactionId: payload.transactionId || `TXN-${Date.now()}`,
  });

  return { wallet, transaction };
};

const getMyWallet = async (userId: string) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({ user: userId, balance: 0, totalExpend: 0 });
  }
  
  const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
  
  return { wallet, transactions };
};

export const WalletService = {
  addMoneyToWallet,
  getMyWallet,
  withdrawMoneyFromWallet: async (userId: string, payload: Partial<TTransaction>) => {
    const { amount } = payload;
    if (!amount || amount <= 0) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid amount');

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    wallet.balance -= amount;
    wallet.totalExpend += amount;
    await wallet.save();

    const transaction = await Transaction.create({
      user: userId,
      amount,
      type: 'out',
      status: 'completed',
      paymentMethod: payload.paymentMethod || 'Withdraw',
      transactionId: payload.transactionId || `TXN-W-${Date.now()}`,
    });

    return { wallet, transaction };
  },
  deleteTransaction: async (userId: string, transactionId: string) => {
    return await Transaction.findOneAndDelete({ _id: transactionId, user: userId });
  },
  deleteAllTransactions: async (userId: string) => {
    return await Transaction.deleteMany({ user: userId });
  },
};
