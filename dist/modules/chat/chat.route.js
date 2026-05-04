"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("./chat.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)('rider', 'driver', 'admin'), chat_controller_1.ChatController.createChat);
router.post('/message', (0, auth_1.default)('rider', 'driver', 'admin'), chat_controller_1.ChatController.sendMessage);
router.get('/:chatId/messages', (0, auth_1.default)('rider', 'driver', 'admin'), chat_controller_1.ChatController.getMessages);
router.get('/my-chats', (0, auth_1.default)('rider', 'driver', 'admin'), chat_controller_1.ChatController.getMyChats);
router.patch('/:chatId/read', (0, auth_1.default)('rider', 'driver', 'admin'), chat_controller_1.ChatController.markMessagesAsRead);
exports.ChatRoutes = router;
