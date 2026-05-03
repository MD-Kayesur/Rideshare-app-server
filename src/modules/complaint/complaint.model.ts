import { Schema, model, Document } from 'mongoose';

export interface TComplaint extends Document {
  user: Schema.Types.ObjectId;
  subject: string;
  message: string;
  isResolved: boolean;
  createdAt: Date;
}

const complaintSchema = new Schema<TComplaint>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Complaint = model<TComplaint>('Complaint', complaintSchema);
