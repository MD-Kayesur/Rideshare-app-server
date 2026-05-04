"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chat_model_1 = require("./chat.model");
const message_model_1 = require("./message.model");
const createChat = async (participants, rideId) => {
    // Sort participants to ensure consistent matching regardless of order
    const participantObjectIds = participants
        .map(p => new mongoose_1.default.Types.ObjectId(p))
        .sort((a, b) => a.toString().localeCompare(b.toString()));
    // Find a chat with EXACTLY these participants
    const query = {
        participants: {
            $all: participantObjectIds,
            $size: participantObjectIds.length
        }
    };
    if (rideId) {
        query.rideId = new mongoose_1.default.Types.ObjectId(rideId);
    }
    else {
        // Prefer a general chat (no rideId)
        const generalChat = await chat_model_1.Chat.findOne({ ...query, rideId: { $exists: false } });
        if (generalChat)
            return generalChat;
    }
    const existingChat = await chat_model_1.Chat.findOne(query);
    if (existingChat) {
        return existingChat;
    }
    const result = await chat_model_1.Chat.create({
        participants: participantObjectIds,
        rideId: rideId ? new mongoose_1.default.Types.ObjectId(rideId) : undefined
    });
    return result;
};
const sendMessage = async (chatId, senderId, content, io) => {
    const finalChatId = chatId;
    // Validate if finalChatId is a valid ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(finalChatId)) {
        throw new Error('Invalid Chat ID');
    }
    // Create message with explicit ObjectIds using .save() for reliability
    const newMessage = new message_model_1.Message({
        chat: new mongoose_1.default.Types.ObjectId(finalChatId),
        sender: new mongoose_1.default.Types.ObjectId(senderId),
        content,
    });
    const result = await newMessage.save();
    // Update last message in chat and increment count
    await chat_model_1.Chat.findByIdAndUpdate(finalChatId, {
        lastMessage: result._id,
        $inc: { messageCount: 1 }
    });
    const populatedMessage = await message_model_1.Message.findById(newMessage._id).populate('sender');
    // Create notification based on sender role
    const sender = populatedMessage?.sender;
    if (sender) {
        const chat = await chat_model_1.Chat.findById(finalChatId);
        if (chat) {
            const { NotificationService } = require('../notification/notification.service');
            if (sender.role === 'admin') {
                // Admin sending to user
                const recipientId = chat.participants.find(p => p.toString() !== sender._id.toString());
                if (recipientId) {
                    await NotificationService.createNotification({
                        recipient: recipientId.toString(),
                        title: 'New Administrative Message',
                        message: `Admin: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
                        type: 'chat',
                        metadata: {
                            chatId: finalChatId,
                            userId: sender._id.toString(),
                            userName: sender.name
                        }
                    });
                }
            }
            else {
                // User sending to admin (or general reply)
                const adminNotification = await NotificationService.createNotification({
                    title: 'New User Reply',
                    message: `${sender.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
                    type: 'chat',
                    metadata: {
                        chatId: finalChatId,
                        userId: sender._id.toString(),
                        userName: sender.name
                    }
                });
                if (io) {
                    io.emit('admin-notification', adminNotification);
                }
            }
        }
    }
    return {
        message: populatedMessage,
        finalChatId
    };
};
const getMessagesByChatId = async (chatId, userId) => {
    const finalChatId = chatId;
    // Final check for valid ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(finalChatId)) {
        return [];
    }
    const result = await message_model_1.Message.find({
        chat: new mongoose_1.default.Types.ObjectId(finalChatId)
    }).populate('sender');
    return result;
};
const getMyChats = async (userId) => {
    const chats = await chat_model_1.Chat.find({ participants: userId })
        .populate('participants')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });
    const result = await Promise.all(chats.map(async (chat) => {
        const unreadCount = await message_model_1.Message.countDocuments({
            chat: chat._id,
            sender: { $ne: userId },
            isRead: false
        });
        return {
            ...chat.toObject(),
            unreadCount
        };
    }));
    return result;
};
const markMessagesAsRead = async (chatId, userId) => {
    return await message_model_1.Message.updateMany({ chat: chatId, sender: { $ne: userId }, isRead: false }, { isRead: true });
};
exports.ChatService = {
    createChat,
    sendMessage,
    getMessagesByChatId,
    getMyChats,
    markMessagesAsRead,
};
