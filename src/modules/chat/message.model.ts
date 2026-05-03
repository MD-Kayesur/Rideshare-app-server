import { Schema, model } from 'mongoose';
import { TMessage } from './chat.interface';

const messageSchema = new Schema<TMessage>(
  {
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'messages' },
);

export const Message = model<TMessage>('Message', messageSchema);
