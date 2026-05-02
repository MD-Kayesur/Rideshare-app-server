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
    const result = await chat_service_1.ChatService.createChat(participants, rideId);
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
    // Validate chatId (Allowing 'default_chat_id' for frontend testing)
    if (!mongoose_1.default.Types.ObjectId.isValid(chatId) && chatId !== 'default_chat_id') {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'Invalid Chat ID',
            data: null,
        });
    }
    const io = (0, socket_io_1.getIo)();
    const { message, finalChatId } = await chat_service_1.ChatService.sendMessage(chatId, senderId, content, io);
    // Emit real-time update to both the requested chatId and the actual finalChatId
    io.to(chatId).emit('new_message', message);
    if (finalChatId !== chatId) {
        io.to(finalChatId).emit('new_message', message);
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
exports.ChatController = {
    createChat,
    sendMessage,
    getMessages,
    getMyChats,
};
