import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  console.log('Registering user with body:', req.body);
  const result = await AuthService.registerUser(req.body);
console.log(result,'result')
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  console.log('Verifying OTP with body:', req.body);
  const result = await AuthService.verifyOTP(req.body);
  console.log(result, 'verifyOTP controller');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP verified successfully',
    data: result,
  });
});

const resendOTP = catchAsync(async (req: Request, res: Response) => {
  console.log('Resending OTP with body:', req.body);
  const { email } = req.body;
  const result = await AuthService.resendOTP(email);
  console.log(result, 'resendOTP controller');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP resent successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  console.log('Logging in user with body:', req.body);
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

export const AuthController = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
};
