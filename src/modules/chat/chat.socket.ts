import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

export const chatSocketHandlers = (io: Server, socket: Socket) => {
  socket.on('join_chat', (chatId: string) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on('send_message', async (data: { chatId: string; senderId: string; content: string }) => {
    const { chatId, senderId, content } = data;
    const message = await ChatService.sendMessage(chatId, senderId, content);
    io.to(chatId).emit('new_message', message);
  });

  socket.on('typing', (data: { chatId: string; userId: string }) => {
    socket.to(data.chatId).emit('user_typing', data);
  });
};
