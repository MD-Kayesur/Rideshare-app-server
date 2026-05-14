import { Schema, model } from 'mongoose';
import { TWallet, TTransaction } from './wallet.interface';

const walletSchema = new Schema<TWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const transactionSchema = new Schema<TTransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['in', 'out'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    paymentGateway: { type: String, enum: ['stripe', 'sslcommerz', 'cash'], default: 'cash' },
    transactionId: { type: String },
  },
  { timestamps: true },
);

export const Wallet = model<TWallet>('Wallet', walletSchema);
export const Transaction = model<TTransaction>('Transaction', transactionSchema);
