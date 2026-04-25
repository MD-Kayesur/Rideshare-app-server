import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatService } from './chat.service';
import { getIo } from '../../socket/socket.io';

const createChat = catchAsync(async (req: Request, res: Response) => {
  const { participants, rideId } = req.body;
  const result = await ChatService.createChat(participants, rideId);

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
  const result = await ChatService.sendMessage(chatId, senderId, content);

  // Emit real-time update
  const io = getIo();
  io.to(chatId).emit('new_message', result);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const result = await ChatService.getMessagesByChatId(chatId);

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

export const ChatController = {
  createChat,
  sendMessage,
  getMessages,
  getMyChats,
};
