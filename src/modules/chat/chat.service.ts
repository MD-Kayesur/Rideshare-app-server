import mongoose from 'mongoose';
import { Chat } from './chat.model';
import { Message } from './message.model';

const createChat = async (participants: string[], rideId?: string) => {
  // Sort participants to ensure consistent matching regardless of order
  const participantObjectIds = participants
    .map(p => new mongoose.Types.ObjectId(p))
    .sort((a, b) => a.toString().localeCompare(b.toString()));
  
  // Find a chat with EXACTLY these participants
  const query: any = {
    participants: { 
      $all: participantObjectIds, 
      $size: participantObjectIds.length 
    }
  };

  if (rideId) {
    query.rideId = new mongoose.Types.ObjectId(rideId);
  } else {
    // Prefer a general chat (no rideId)
    const generalChat = await Chat.findOne({ ...query, rideId: { $exists: false } });
    if (generalChat) return generalChat;
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

  // Update last message in chat and increment count
  await Chat.findByIdAndUpdate(finalChatId, { 
    lastMessage: result._id,
    $inc: { messageCount: 1 }
  });
  
  const populatedMessage = await Message.findById(newMessage._id).populate('sender');
  
  // Create notification if Admin sends a message to a non-admin
  const sender = populatedMessage?.sender as any;
  if (sender && sender.role === 'admin') {
    const chat = await Chat.findById(finalChatId);
    if (chat) {
        // Find the other participant (the one who isn't the admin)
        const recipientId = chat.participants.find(p => p.toString() !== sender._id.toString());
        if (recipientId) {
            const { NotificationService } = require('../notification/notification.service');
            await NotificationService.createNotification({
                recipient: recipientId.toString(),
                title: 'New Administrative Message',
                message: `Admin: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
                type: 'chat',
                metadata: {
                    chatId: finalChatId,
                    userId: sender._id.toString(),
                    userName: sender.name
                }
            });
        }
    }
  }

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
  const chats = await Chat.find({ participants: userId })
    .populate('participants')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

  const result = await Promise.all(chats.map(async (chat) => {
    const unreadCount = await Message.countDocuments({
      chat: chat._id,
      sender: { $ne: userId },
      isRead: false
    });
    return {
      ...chat.toObject(),
      unreadCount
    };
  }));

  return result;
};

const markMessagesAsRead = async (chatId: string, userId: string) => {
    return await Message.updateMany(
        { chat: chatId, sender: { $ne: userId }, isRead: false },
        { isRead: true }
    );
};

export const ChatService = {
  createChat,
  sendMessage,
  getMessagesByChatId,
  getMyChats,
  markMessagesAsRead,
};
