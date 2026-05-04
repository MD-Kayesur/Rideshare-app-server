import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ComplaintService } from './complaint.service';
import { getIo } from '../../socket/socket.io';
import { NotificationService } from '../notification/notification.service';

const createComplaint = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { result, notification } = await ComplaintService.createComplaint(userId, req.body);

  // Emit real-time notification to admin
  const io = getIo();
  io.emit('admin-notification', notification);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Complaint submitted successfully',
    data: result,
  });
});

const getAllComplaints = catchAsync(async (req: Request, res: Response) => {
  const result = await ComplaintService.getAllComplaints();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All complaints fetched successfully',
    data: result,
  });
});

const resolveComplaint = catchAsync(async (req: Request, res: Response) => {
  const { complaintId } = req.params;
  const result = await ComplaintService.resolveComplaint(complaintId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Complaint resolved successfully',
    data: result,
  });
});

export const ComplaintController = {
  createComplaint,
  getAllComplaints,
  resolveComplaint,
};
