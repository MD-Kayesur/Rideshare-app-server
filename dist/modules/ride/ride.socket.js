"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideSocketHandlers = void 0;
const rideSocketHandlers = (io, socket) => {
    socket.on('join-ride', (rideId) => {
        socket.join(rideId);
        console.log(`User ${socket.id} joined ride room: ${rideId}`);
    });
    socket.on('leave-ride', (rideId) => {
        socket.leave(rideId);
        console.log(`User ${socket.id} left ride room: ${rideId}`);
    });
};
exports.rideSocketHandlers = rideSocketHandlers;
