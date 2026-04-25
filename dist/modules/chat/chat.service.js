"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
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
const sendMessage = async (chatId, senderId, content) => {
    const result = await message_model_1.Message.create({
        chat: chatId,
        sender: senderId,
        content,
    });
    await chat_model_1.Chat.findByIdAndUpdate(chatId, { lastMessage: result._id });
    return result;
};
const getMessagesByChatId = async (chatId) => {
    const result = await message_model_1.Message.find({ chat: chatId }).populate('sender');
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
