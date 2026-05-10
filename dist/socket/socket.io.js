"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const chat_socket_1 = require("../modules/chat/chat.socket");
const call_socket_1 = require("../modules/call/call.socket");
const ride_socket_1 = require("../modules/ride/ride.socket");
let io;
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    console.log('socket io connection successfully');
    io.on('connection', (socket) => {
        console.log('socket io connection successfully');
        console.log('A user connected:', socket.id);
        // Initialize module-specific socket handlers
        (0, chat_socket_1.chatSocketHandlers)(io, socket);
        (0, call_socket_1.callSocketHandlers)(io, socket);
        (0, ride_socket_1.rideSocketHandlers)(io, socket);
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their personal room`);
        });
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
