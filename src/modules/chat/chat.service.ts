import { Chat } from './chat.model';
import { Message } from './message.model';

const createChat = async (participants: string[], rideId?: string) => {
  const existingChat = await Chat.findOne({
    participants: { $all: participants },
    rideId,
  });

  if (existingChat) {
    return existingChat;
  }

  const result = await Chat.create({ participants, rideId });
  return result;
};

const sendMessage = async (chatId: string, senderId: string, content: string) => {
  const result = await Message.create({
    chat: chatId,
    sender: senderId,
    content,
  });

  await Chat.findByIdAndUpdate(chatId, { lastMessage: result._id });
  return result;
};

const getMessagesByChatId = async (chatId: string) => {
  const result = await Message.find({ chat: chatId }).populate('sender');
  return result;
};

const getMyChats = async (userId: string) => {
  const result = await Chat.find({ participants: userId })
    .populate('participants')
    .populate('lastMessage');
  return result;
};

export const ChatService = {
  createChat,
  sendMessage,
  getMessagesByChatId,
  getMyChats,
};
