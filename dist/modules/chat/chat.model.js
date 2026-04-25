"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' },
    rideId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Ride' },
}, { timestamps: true });
exports.Chat = (0, mongoose_1.model)('Chat', chatSchema);
