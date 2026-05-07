import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationService } from './notification.service';

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.getAllNotifications();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications fetched successfully',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.markAsRead(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: result,
  });
});

const getMyNotifications = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.userId;
  const result = await NotificationService.getNotificationsForUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My notifications fetched successfully',
    data: result,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await NotificationService.deleteNotification(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: result,
  });
});

const deleteAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.deleteAllNotifications();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications deleted successfully',
    data: result,
  });
});

export const NotificationController = {
  getAllNotifications,
  markAsRead,
  getMyNotifications,
  deleteNotification,
  deleteAllNotifications,
};
