import { Types } from 'mongoose';

export type TChat = {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  rideId?: Types.ObjectId;
};

export type TMessage = {
  chat: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  isRead: boolean;
};
