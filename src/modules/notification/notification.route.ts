import { Router } from 'express';
import auth from '../../middlewares/auth';
import { NotificationController } from './notification.controller';

const router = Router();

router.get('/', auth('admin'), NotificationController.getAllNotifications);
router.patch('/:id/read', auth('admin'), NotificationController.markAsRead);

export const NotificationRoutes = router;
