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
  let finalChatId = chatId;

  // For testing purposes: handle 'default_chat_id'
  if (chatId === 'default_chat_id') {
    let testChat = await Chat.findOne({ participants: senderId });
    if (!testChat) {
      testChat = await Chat.create({ participants: [senderId] });
    }
    finalChatId = (testChat._id as any).toString();
  }

  const result = await Message.create({
    chat: finalChatId,
    sender: senderId,
    content,
  });

  // Populate sender info so socket broadcast includes user details
  await result.populate('sender');

  await Chat.findByIdAndUpdate(finalChatId, { lastMessage: result._id });
  return result;
};

const getMessagesByChatId = async (chatId: string) => {
  let finalChatId = chatId;

  if (chatId === 'default_chat_id') {
    const testChat = await Chat.findOne({
      participants: { $exists: true },
    });
    if (testChat) {
      finalChatId = (testChat._id as any).toString();
    }
  }

  const result = await Message.find({ chat: finalChatId }).populate('sender');
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
