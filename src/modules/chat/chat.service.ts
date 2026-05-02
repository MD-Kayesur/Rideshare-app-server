import mongoose from 'mongoose';
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

const sendMessage = async (chatId: string, senderId: string, content: string, io: any) => {
  let finalChatId = chatId;

  // For testing purposes: handle 'default_chat_id'
  if (chatId === 'default_chat_id') {
    // Find any chat for this user
    let testChat = await Chat.findOne({ 
      participants: { $in: [new mongoose.Types.ObjectId(senderId)] } 
    });
    
    if (!testChat) {
      // Create a new one if not found
      testChat = await Chat.create({ 
        participants: [new mongoose.Types.ObjectId(senderId)] 
      });
    }
    finalChatId = testChat._id.toString();
  }

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
  let finalChatId = chatId;

  if (chatId === 'default_chat_id' && userId) {
    const testChat = await Chat.findOne({
      participants: { $in: [new mongoose.Types.ObjectId(userId)] },
    });
    if (testChat) {
      finalChatId = testChat._id.toString();
    } else {
      return []; 
    }
  }

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
