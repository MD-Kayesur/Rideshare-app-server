import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { VehicleService } from './vehicle.service';

const addVehicle = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await VehicleService.addVehicleIntoDB({
    ...req.body,
    driver: userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Vehicle added successfully',
    data: result,
  });
});

const getMyVehicles = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await VehicleService.getMyVehiclesFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicles retrieved successfully',
    data: result,
  });
});

const deleteVehicle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await VehicleService.deleteVehicleFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle deleted successfully',
    data: null,
  });
});

export const VehicleController = {
  addVehicle,
  getMyVehicles,
  deleteVehicle,
};
