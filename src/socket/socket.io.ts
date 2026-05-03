import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { chatSocketHandlers } from '../modules/chat/chat.socket';
import { callSocketHandlers } from '../modules/call/call.socket';
import { rideSocketHandlers } from '../modules/ride/ride.socket';

let io: SocketServer;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: { 
      origin: '*', 'l'
    },
  });

  console.log('socket io connection successfully');

  io.on('connection', (socket) => {
    console.log('socket io connection successfully');
    console.log('A user connected:', socket.id);

    // Initialize module-specific socket handlers
    chatSocketHandlers(io, socket);
    callSocketHandlers(io, socket);
    rideSocketHandlers(io, socket);

    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
