import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

export const chatSocketHandlers = (io: Server, socket: Socket) => {
  socket.on('join_chat', (chatId: string) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });


  socket.on('typing', (data: { chatId: string; userId: string }) => {
    socket.to(data.chatId).emit('user_typing', data);
  });
};
