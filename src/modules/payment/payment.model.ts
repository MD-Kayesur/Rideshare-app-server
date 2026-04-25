import { Schema, model, Types } from 'mongoose';

export type TPayment = {
  transactionId: string;
  ride: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  paymentGateway: 'stripe' | 'sslcommerz';
  paymentData?: any;
};

const paymentSchema = new Schema<TPayment>(
  {
    transactionId: { type: String, required: true, unique: true },
    ride: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'BDT' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'sslcommerz'],
      required: true,
    },
    paymentData: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Payment = model<TPayment>('Payment', paymentSchema);
