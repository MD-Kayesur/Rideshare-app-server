import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CallService } from './call.service';

const startCall = catchAsync(async (req: Request, res: Response) => {
  const result = await CallService.startCall(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Call started successfully',
    data: result,
  });
});

const endCall = catchAsync(async (req: Request, res: Response) => {
  const { callId, duration } = req.body;
  const result = await CallService.endCall(callId, duration);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Call ended successfully',
    data: result,
  });
});

const getMyCallLogs = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await CallService.getCallLogsForUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Call logs retrieved successfully',
    data: result,
  });
});

export const CallController = {
  startCall,
  endCall,
  getMyCallLogs,
};
