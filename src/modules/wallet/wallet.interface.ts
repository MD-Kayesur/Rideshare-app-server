import { Types } from 'mongoose';

export type TWallet = {
  user: Types.ObjectId;
  balance: number;
};

export type TTransaction = {
  user: Types.ObjectId;
  amount: number;
  type: 'in' | 'out';
  status: 'pending' | 'completed' | 'failed';
  paymentGateway?: 'stripe' | 'sslcommerz' | 'cash';
  transactionId?: string;
};
