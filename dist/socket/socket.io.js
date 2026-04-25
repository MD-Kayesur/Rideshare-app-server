"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const chat_socket_1 = require("../modules/chat/chat.socket");
const call_socket_1 = require("../modules/call/call.socket");
let io;
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        // Initialize module-specific socket handlers
        (0, chat_socket_1.chatSocketHandlers)(io, socket);
        (0, call_socket_1.callSocketHandlers)(io, socket);
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
exports.getIo = getIo;
