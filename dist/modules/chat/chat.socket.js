"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocketHandlers = void 0;
const chat_service_1 = require("./chat.service");
const chatSocketHandlers = (io, socket) => {
    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
    });
    socket.on('send_message', async (data) => {
        const { chatId, senderId, content } = data;
        const message = await chat_service_1.ChatService.sendMessage(chatId, senderId, content);
        io.to(chatId).emit('new_message', message);
    });
    socket.on('typing', (data) => {
        socket.to(data.chatId).emit('user_typing', data);
    });
};
exports.chatSocketHandlers = chatSocketHandlers;
