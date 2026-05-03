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
    const existingChat = await chat_model_1.Chat.findOne({
        participants: { $all: participants },
        rideId,
    });
    if (existingChat) {
        return existingChat;
    }
    const result = await chat_model_1.Chat.create({ participants, rideId });
    return result;
};
const sendMessage = async (chatId, senderId, content, io) => {
    let finalChatId = chatId;
    // For testing purposes: handle 'default_chat_id'
    if (chatId === 'default_chat_id') {
        // Find any chat for this user
        let testChat = await chat_model_1.Chat.findOne({
            participants: { $in: [new mongoose_1.default.Types.ObjectId(senderId)] }
        });
        if (!testChat) {
            // Create a new one if not found
            testChat = await chat_model_1.Chat.create({
                participants: [new mongoose_1.default.Types.ObjectId(senderId)]
            });
        }
        finalChatId = testChat._id.toString();
    }
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
    // Update last message in chat
    await chat_model_1.Chat.findByIdAndUpdate(finalChatId, {
        lastMessage: result._id
    });
    const populatedMessage = await message_model_1.Message.findById(newMessage._id).populate('sender');
    return {
        message: populatedMessage,
        finalChatId
    };
};
const getMessagesByChatId = async (chatId, userId) => {
    let finalChatId = chatId;
    if (chatId === 'default_chat_id' && userId) {
        const testChat = await chat_model_1.Chat.findOne({
            participants: { $in: [new mongoose_1.default.Types.ObjectId(userId)] },
        });
        if (testChat) {
            finalChatId = testChat._id.toString();
        }
        else {
            return [];
        }
    }
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
    const result = await chat_model_1.Chat.find({ participants: userId })
        .populate('participants')
        .populate('lastMessage');
    return result;
};
exports.ChatService = {
    createChat,
    sendMessage,
    getMessagesByChatId,
    getMyChats,
};
