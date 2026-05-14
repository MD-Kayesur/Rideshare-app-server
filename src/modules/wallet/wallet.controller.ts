import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { WalletService } from './wallet.service';

const addMoney = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await WalletService.addMoneyToWallet(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Money added successfully',
    data: result,
  });
});

const getMyWallet = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await WalletService.getMyWallet(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wallet retrieved successfully',
    data: result,
  });
});

export const WalletController = {
  addMoney,
  getMyWallet,
};
