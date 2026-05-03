import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.updateUserIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is deleted successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await UserService.getMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile is retrieved successfully',
    data: result,
  });
});

const toggleOnlineStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { isOnline } = req.body;
  const result = await UserService.toggleOnlineStatus(userId, isOnline);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Online status updated successfully',
    data: result,
  });
});

const updateLocation = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { longitude, latitude } = req.body;
  const result = await UserService.updateLocation(userId, longitude, latitude);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Location updated successfully',
    data: result,
  });
});

const banUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isBanned } = req.body;
  const result = await UserService.banUser(id, isBanned);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMe,
  toggleOnlineStatus,
  updateLocation,
  banUser,
};
