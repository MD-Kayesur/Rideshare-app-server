import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DriverController } from './driver.controller';
import { DriverValidation } from './driver.validation';

const router = Router();

router.post(
  '/',
  auth('driver'),
  validateRequest(DriverValidation.createDriverValidationSchema),
  DriverController.createDriver
);

router.get(
  '/me',
  auth('driver'),
  DriverController.getMyDriverProfile
);

router.patch(
  '/me',
  auth('driver'),
  validateRequest(DriverValidation.updateDriverValidationSchema),
  DriverController.updateDriver
);

router.get(
  '/',
  auth('admin'),
  DriverController.getAllDrivers
);

router.get(
  '/nearby',
  auth('rider', 'driver', 'admin'),
  DriverController.getNearbyDrivers
);

router.get(
  '/pending',
  auth('admin'),
  DriverController.getPendingDrivers
);

router.patch(
  '/verify/:driverId',
  auth('admin'),
  DriverController.verifyDriver
);

router.get(
  '/:userId',
  auth('rider', 'driver', 'admin'),
  DriverController.getDriverById
);

export const DriverRoutes = router;
