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

const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await WalletService.withdrawMoneyFromWallet(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Money withdrawn successfully',
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

const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  await WalletService.deleteTransaction(userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transaction deleted successfully',
    data: null,
  });
});

const deleteAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  await WalletService.deleteAllTransactions(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All transactions deleted successfully',
    data: null,
  });
});

export const WalletController = {
  addMoney,
  getMyWallet,
  deleteTransaction,
  deleteAllTransactions,
  withdrawMoney,
};
