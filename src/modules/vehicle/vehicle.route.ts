import express from 'express';
import auth from '../../middlewares/auth';
import { VehicleController } from './vehicle.controller';

const router = express.Router();

router.post(
  '/add',
  auth('driver'),
  VehicleController.addVehicle,
);

router.get(
  '/my-vehicles',
  auth('driver'),
  VehicleController.getMyVehicles,
);

router.delete(
  '/:id',
  auth('driver'),
  VehicleController.deleteVehicle,
);

export const VehicleRoutes = router;
