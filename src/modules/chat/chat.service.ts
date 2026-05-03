import mongoose from 'mongoose';
import { Chat } from './chat.model';
import { Message } from './message.model';

const createChat = async (participants: string[], rideId?: string) => {
  const participantObjectIds = participants.map(p => new mongoose.Types.ObjectId(p));
  
  // Find a chat with EXACTLY these participants
  const query: any = {
    participants: { 
      $all: participantObjectIds, 
      $size: participantObjectIds.length 
    }
  };

  if (rideId) {
    query.rideId = new mongoose.Types.ObjectId(rideId);
  }

  const existingChat = await Chat.findOne(query);

  if (existingChat) {
    return existingChat;
  }

  const result = await Chat.create({ 
    participants: participantObjectIds, 
    rideId: rideId ? new mongoose.Types.ObjectId(rideId) : undefined 
  });
  return result;
};

const sendMessage = async (chatId: string, senderId: string, content: string, io: any) => {
  const finalChatId = chatId;

  // Validate if finalChatId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(finalChatId)) {
    throw new Error('Invalid Chat ID');
  }

  // Create message with explicit ObjectIds using .save() for reliability
  const newMessage = new Message({
    chat: new mongoose.Types.ObjectId(finalChatId),
    sender: new mongoose.Types.ObjectId(senderId),
    content,
  });

  const result = await newMessage.save();

  // Update last message in chat
  await Chat.findByIdAndUpdate(finalChatId, { 
    lastMessage: result._id 
  });
  
  const populatedMessage = await Message.findById(newMessage._id).populate('sender');
  
  return {
    message: populatedMessage,
    finalChatId
  };
};

const getMessagesByChatId = async (chatId: string, userId?: string) => {
  const finalChatId = chatId;

  // Final check for valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(finalChatId)) {
    return [];
  }

  const result = await Message.find({ 
    chat: new mongoose.Types.ObjectId(finalChatId) 
  }).populate('sender');
  
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
