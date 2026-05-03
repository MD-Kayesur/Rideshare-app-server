import mongoose from 'mongoose';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatService } from './chat.service';
import { getIo } from '../../socket/socket.io';

const createChat = catchAsync(async (req: Request, res: Response) => {
  const { participants, rideId } = req.body;
  const senderId = req.user.userId;
  
  // Validate participants
  const participantsArray = Array.isArray(participants) ? participants : [];
  
  // Filter out any null/undefined or invalid ObjectIds to prevent 500 errors
  const validParticipants = participantsArray.filter(p => p && mongoose.Types.ObjectId.isValid(p));
  
  // Ensure the creator is part of the chat
  const allParticipants = [...new Set([...validParticipants, senderId])].filter(p => mongoose.Types.ObjectId.isValid(p as string));
  
  const result = await ChatService.createChat(allParticipants as string[], rideId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Chat created successfully',
    data: result,
  });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { chatId, content } = req.body;
  const senderId = req.user.userId;

  // Validate chatId
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Invalid Chat ID',
      data: null,
    });
  }

  const io = getIo();
  const { message } = await ChatService.sendMessage(chatId, senderId, content, io);
  
  // 1. Emit real-time update to the chat room
  io.to(chatId).emit('new_message', message);

  // 2. Fail-safe: Also emit to each participant's personal room for guaranteed delivery
  const chat = await ChatService.getMyChats(senderId); // Or better, fetch the specific chat
  // For efficiency, let's just use the sendMessage return if it had participants, 
  // but let's fetch it here to be sure.
  const currentChat = await (mongoose.model('Chat') as any).findById(chatId);
  if (currentChat && currentChat.participants) {
    currentChat.participants.forEach((p: any) => {
        io.to(p.toString()).emit('new_message', message);
    });
  }
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Message sent successfully',
    data: message,
  });
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const userId = req.user.userId;
  const result = await ChatService.getMessagesByChatId(chatId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

const getMyChats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await ChatService.getMyChats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chats retrieved successfully',
    data: result,
  });
});

const markMessagesAsRead = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const userId = req.user.userId;
  const result = await ChatService.markMessagesAsRead(chatId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages marked as read successfully',
    data: result,
  });
});

export const ChatController = {
  createChat,
  sendMessage,
  getMessages,
  getMyChats,
  markMessagesAsRead,
};
