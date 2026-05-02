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

export const DriverController = {
  createDriver,
  getMyDriverProfile,
  updateDriver,
  getDriverById,
  getAllDrivers,
};
