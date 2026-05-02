import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DriverService } from './driver.service';

const createDriver = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await DriverService.createDriver(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Driver profile created successfully',
    data: result,
  });
});

const getMyDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await DriverService.getDriverByUserId(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver profile fetched successfully',
    data: result,
  });
});

const updateDriver = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await DriverService.updateDriver(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver profile updated successfully',
    data: result,
  });
});

const getDriverById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await DriverService.getDriverByUserId(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver profile fetched successfully',
    data: result,
  });
});

const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.getAllDrivers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All drivers fetched successfully',
    data: result,
  });
});

const getNearbyDrivers = catchAsync(async (req: Request, res: Response) => {
  const { lat, lng, vehicleType } = req.query;
  
  if (!lat || !lng) {
    throw new Error('Latitude and longitude are required');
  }

  const result = await DriverService.getNearbyDrivers(
    Number(lat),
    Number(lng),
    vehicleType as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Nearby drivers fetched successfully',
    data: result,
  });
});

const getPendingDrivers = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.getPendingDrivers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pending drivers fetched successfully',
    data: result,
  });
});

const verifyDriver = catchAsync(async (req: Request, res: Response) => {
  const { driverId } = req.params;
  const result = await DriverService.verifyDriver(driverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver verified successfully',
    data: result,
  });
});

export const DriverController = {
  createDriver,
  getMyDriverProfile,
  updateDriver,
  getDriverById,
  getAllDrivers,
  getNearbyDrivers,
  getPendingDrivers,
  verifyDriver,
};
