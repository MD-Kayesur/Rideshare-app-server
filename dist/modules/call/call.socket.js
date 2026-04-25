"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callSocketHandlers = void 0;
const callSocketHandlers = (io, socket) => {
    socket.on('call_user', (data) => {
        io.to(data.userToCall).emit('call_user', {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });
    socket.on('answer_call', (data) => {
        io.to(data.to).emit('call_accepted', data.signal);
    });
    socket.on('end_call', (data) => {
        io.to(data.to).emit('call_ended');
    });
};
exports.callSocketHandlers = callSocketHandlers;
