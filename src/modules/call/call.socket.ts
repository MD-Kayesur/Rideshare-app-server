import { Server, Socket } from 'socket.io';

export const callSocketHandlers = (io: Server, socket: Socket) => {
  socket.on('call_user', (data: { userToCall: string; signalData: any; from: string; name: string }) => {
    io.to(data.userToCall).emit('call_user', {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on('answer_call', (data: { to: string; signal: any }) => {
    io.to(data.to).emit('call_accepted', data.signal);
  });

  socket.on('end_call', (data: { to: string }) => {
    io.to(data.to).emit('call_ended');
  });
};
