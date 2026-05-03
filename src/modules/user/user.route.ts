import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth('admin'), UserController.getAllUsers);

router.get('/me', auth('rider', 'driver', 'admin'), UserController.getMe);

router.get('/:id', auth('admin'), UserController.getSingleUser);

router.patch(
  '/toggle-online',
  auth('driver'),
  UserController.toggleOnlineStatus,
);

router.patch(
  '/update-location',
  auth('rider', 'driver'),
  UserController.updateLocation,
);

router.patch(
  '/:id',
  auth('admin', 'rider', 'driver'),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser,
);

router.patch(
  '/:id/ban',
  auth('admin'),
  UserController.banUser,
);

router.delete('/:id', auth('admin'), UserController.deleteUser);

export const UserRoutes = router;
