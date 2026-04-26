"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocketHandlers = void 0;
const chatSocketHandlers = (io, socket) => {
    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
    });
    socket.on('typing', (data) => {
        socket.to(data.chatId).emit('user_typing', data);
    });
};
exports.chatSocketHandlers = chatSocketHandlers;
