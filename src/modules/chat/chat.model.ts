import { Schema, model } from 'mongoose';
import { TChat } from './chat.interface';

const chatSchema = new Schema<TChat>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride' },
  },
  { timestamps: true, collection: 'chats' },
);

export const Chat = model<TChat>('Chat', chatSchema);
