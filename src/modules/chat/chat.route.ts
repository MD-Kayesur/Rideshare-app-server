import express from 'express';
import { ChatController } from './chat.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/', auth('rider', 'driver'), ChatController.createChat);
router.post('/message', auth('rider', 'driver'), ChatController.sendMessage);
router.get('/:chatId/messages', auth('rider', 'driver'), ChatController.getMessages);
router.get('/my-chats', auth('rider', 'driver'), ChatController.getMyChats);

export const ChatRoutes = router;
