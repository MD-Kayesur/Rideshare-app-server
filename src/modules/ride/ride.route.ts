import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RideController } from './ride.controller';
import { RideValidation } from './ride.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('rider'),
  validateRequest(RideValidation.createRideValidationSchema),
  RideController.createRide,
);

router.get('/', auth('admin', 'driver', 'rider'), RideController.getAllRides);

router.get('/:id', auth('admin', 'driver', 'rider'), RideController.getSingleRide);

router.patch(
  '/:id',
  auth('admin', 'driver', 'rider'),
  validateRequest(RideValidation.updateRideStatusValidationSchema),
  RideController.updateRide,
);

router.patch(
  '/:rideId/accept',
  auth('driver'),
  RideController.acceptRideRequest,
);

router.patch(
  '/:rideId/start',
  auth('driver'),
  RideController.startRide,
);

router.patch(
  '/:rideId/complete',
  auth('driver'),
  RideController.completeRide,
);

router.patch(
  '/:rideId/cancel',
  auth('rider', 'driver', 'admin'),
  RideController.cancelRide,
);

router.patch(
  '/:rideId/rate',
  auth('rider', 'driver'),
  RideController.rateRide,
);

export const RideRoutes = router;
