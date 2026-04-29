import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RideService } from './ride.service';
import { getIo } from '../../socket/socket.io';

const createRide = catchAsync(async (req: Request, res: Response) => {
  const rideData = { ...req.body, rider: req.user.userId };
  const result = await RideService.createRideIntoDB(rideData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Ride requested successfully',
    data: result,
  });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const result = await RideService.getAllRidesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rides are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleRide = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RideService.getSingleRideFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ride is retrieved successfully',
    data: result,
  });
});

const updateRide = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RideService.updateRideIntoDB(id, req.body);

  if (result) {
    const io = getIo();
    io.to(id).emit('ride-updated', result);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ride is updated successfully',
    data: result,
  });
});

const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const driverId = req.user.userId;
  const result = await RideService.acceptRideRequest(id, driverId);

  if (result) {
    const io = getIo();
    io.to(id).emit('ride-accepted', result);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ride accepted successfully',
    data: result,
  });
});

export const RideController = {
  createRide,
  getAllRides,
  getSingleRide,
  updateRide,
  acceptRide,
};
