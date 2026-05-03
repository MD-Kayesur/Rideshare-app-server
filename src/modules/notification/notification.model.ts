import { Schema, model, Document } from 'mongoose';

export interface TNotification extends Document {
  recipient: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: 'complaint' | 'driver_request' | 'ride_update' | 'payment';
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<TNotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['complaint', 'driver_request', 'ride_update', 'payment'],
      required: true,
    },
    isRead: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Notification = model<TNotification>('Notification', notificationSchema);
