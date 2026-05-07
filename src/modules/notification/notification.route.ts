import { Router } from 'express';
import auth from '../../middlewares/auth';
import { NotificationController } from './notification.controller';

const router = Router();

router.get('/', auth('admin'), NotificationController.getAllNotifications);
router.get('/me', auth('rider', 'driver', 'admin'), NotificationController.getMyNotifications);
router.patch('/:id/read', auth('rider', 'driver', 'admin'), NotificationController.markAsRead);
router.delete('/:id', auth('admin'), NotificationController.deleteNotification);
router.delete('/', auth('admin'), NotificationController.deleteAllNotifications);

export const NotificationRoutes = router;
