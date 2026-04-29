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
    let finalChatId = chatId;
    // For testing purposes: handle 'default_chat_id'
    if (chatId === 'default_chat_id') {
        let testChat = await chat_model_1.Chat.findOne({ participants: senderId });
        if (!testChat) {
            testChat = await chat_model_1.Chat.create({ participants: [senderId] });
        }
        finalChatId = testChat._id.toString();
    }
    const result = await message_model_1.Message.create({
        chat: finalChatId,
        sender: senderId,
        content,
    });
    // Populate sender info so socket broadcast includes user details
    await result.populate('sender');
    await chat_model_1.Chat.findByIdAndUpdate(finalChatId, { lastMessage: result._id });
    return result;
};
const getMessagesByChatId = async (chatId) => {
    let finalChatId = chatId;
    if (chatId === 'default_chat_id') {
        const testChat = await chat_model_1.Chat.findOne({
            participants: { $exists: true },
        });
        if (testChat) {
            finalChatId = testChat._id.toString();
        }
    }
    const result = await message_model_1.Message.find({ chat: finalChatId }).populate('sender');
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
