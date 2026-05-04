"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const chat_service_1 = require("./chat.service");
const socket_io_1 = require("../../socket/socket.io");
const createChat = (0, catchAsync_1.default)(async (req, res) => {
    const { participants, rideId } = req.body;
    const senderId = req.user.userId;
    // Validate participants
    const participantsArray = Array.isArray(participants) ? participants : [];
    // Filter out any null/undefined or invalid ObjectIds to prevent 500 errors
    const validParticipants = participantsArray.filter(p => p && mongoose_1.default.Types.ObjectId.isValid(p));
    // Ensure the creator is part of the chat
    const allParticipants = [...new Set([...validParticipants, senderId])].filter(p => mongoose_1.default.Types.ObjectId.isValid(p));
    const result = await chat_service_1.ChatService.createChat(allParticipants, rideId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Chat created successfully',
        data: result,
    });
});
const sendMessage = (0, catchAsync_1.default)(async (req, res) => {
    const { chatId, content } = req.body;
    const senderId = req.user.userId;
    // Validate chatId
    if (!mongoose_1.default.Types.ObjectId.isValid(chatId)) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'Invalid Chat ID',
            data: null,
        });
    }
    const io = (0, socket_io_1.getIo)();
    const { message } = await chat_service_1.ChatService.sendMessage(chatId, senderId, content, io);
    // 1. Emit real-time update to the chat room
    io.to(chatId).emit('new_message', message);
    // 2. Fail-safe: Also emit to each participant's personal room for guaranteed delivery
    const chat = await chat_service_1.ChatService.getMyChats(senderId); // Or better, fetch the specific chat
    // For efficiency, let's just use the sendMessage return if it had participants, 
    // but let's fetch it here to be sure.
    const currentChat = await mongoose_1.default.model('Chat').findById(chatId);
    if (currentChat && currentChat.participants) {
        currentChat.participants.forEach((p) => {
            io.to(p.toString()).emit('new_message', message);
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Message sent successfully',
        data: message,
    });
});
const getMessages = (0, catchAsync_1.default)(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.userId;
    const result = await chat_service_1.ChatService.getMessagesByChatId(chatId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
    });
});
const getMyChats = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await chat_service_1.ChatService.getMyChats(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Chats retrieved successfully',
        data: result,
    });
});
const markMessagesAsRead = (0, catchAsync_1.default)(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.userId;
    const result = await chat_service_1.ChatService.markMessagesAsRead(chatId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Messages marked as read successfully',
        data: result,
    });
});
exports.ChatController = {
    createChat,
    sendMessage,
    getMessages,
    getMyChats,
    markMessagesAsRead,
};
