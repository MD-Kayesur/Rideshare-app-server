"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    chat: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true, collection: 'messages' });
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
