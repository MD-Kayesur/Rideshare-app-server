import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RideService } from './ride.service';
import { getIo } from '../../socket/socket.io';

const createRide = catchAsync(async (req: Request, res: Response) => {
  const { pickupLocation, rideType } = req.body;
  const riderId = req.user.userId;
  
  // 1. Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  const rideData = { ...req.body, rider: riderId, otp };
  const result = await RideService.createRideIntoDB(rideData);

  // 2. Notify nearby drivers
  const nearbyDrivers = await RideService.findNearbyDrivers(
    pickupLocation.coordinates[0],
    pickupLocation.coordinates[1],
    rideType
  );

  const io = getIo();
  nearbyDrivers.forEach((driver) => {
    io.to(driver.user?._id.toString()).emit('new-ride-request', result);
  });

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

const acceptRideRequest = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const driverId = req.user.userId;
  const result = await RideService.acceptRideRequest(rideId, driverId);

  if (result) {
    const io = getIo();
    io.to(rideId).emit('ride-accepted', result);
    io.to(result.rider.toString()).emit('your-ride-accepted', result);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ride accepted successfully',
    data: result,
  });
});

const startRide = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const { otp } = req.body;
  const result = await RideService.startRide(rideId, otp);

  if (result) {
    const io = getIo();
    io.to(rideId).emit('ride-started', result);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ride started successfully',
    data: result,
  });
});

const completeRide = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const result = await RideService.completeRide(rideId);

  if (result) {
    const io = getIo();
    io.to(rideId).emit('ride-completed', result);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ride completed successfully',
    data: result,
  });
});

const cancelRide = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const result = await RideService.cancelRide(rideId);

  if (result) {
    const io = getIo();
    io.to(rideId).emit('ride-cancelled', result);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ride cancelled successfully',
    data: result,
  });
});

const rateRide = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const { rating, feedback } = req.body;
  const ratedBy = req.user.userId;

  const result = await RideService.rateRide(rideId, rating, feedback, ratedBy);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ride rated successfully',
    data: result,
  });
});

export const RideController = {
  createRide,
  getAllRides,
  getSingleRide,
  updateRide,
  acceptRideRequest,
  startRide,
  completeRide,
  cancelRide,
  rateRide,
};
