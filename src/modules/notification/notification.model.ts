import { Schema, model, Document } from 'mongoose';

export interface TNotification extends Document {
  title: string;
  message: string;
  type: 'complaint' | 'driver_request';
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<TNotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['complaint', 'driver_request'], required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = model<TNotification>('Notification', notificationSchema);
