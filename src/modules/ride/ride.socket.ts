import { Server, Socket } from 'socket.io';

export const rideSocketHandlers = (io: Server, socket: Socket) => {
  socket.on('join-ride', (rideId: string) => {
    socket.join(rideId);
    console.log(`User ${socket.id} joined ride room: ${rideId}`);
  });

  socket.on('leave-ride', (rideId: string) => {
    socket.leave(rideId);
    console.log(`User ${socket.id} left ride room: ${rideId}`);
  });
};
