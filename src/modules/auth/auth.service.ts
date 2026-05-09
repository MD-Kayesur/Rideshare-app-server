import { User } from '../user/user.model';
import { TUser } from '../user/user.interface';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { sendEmail } from '../../utils/sendEmail';

const registerUser = async (payload: TUser) => {
  console.log('registerUser payload:', payload);
  // Generate 5-digit OTP
  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const result = await User.create({
    ...payload,
    verificationCode,
    verificationCodeExpires,
    currentLocation: {
      type: 'Point',
      coordinates: [90.4125, 23.8103], // Default to Dhaka for testing
    }
  });

  console.log({ ...result.toObject(), verificationCode }, 'result service');
  // Send the code via Email (wrapped in try-catch to avoid failing registration if email service is not configured)
  try {
    await sendEmail(
      payload.email,
      'Verify your account',
      `<h1>Verification Code</h1><p>Your code is <strong>${verificationCode}</strong>. It expires in 10 minutes.</p>`,
    );
  } catch (error) {
    console.error('Email sending failed, but user was created:', error);
  }

  return {
    user: result,
    verificationCode, // Added for practice purpose
  };
};

const verifyOTP = async (payload: { email: string; code: string }) => {
  const user = await User.findOne({
    email: payload.email,
    verificationCode: payload.code,
    verificationCodeExpires: { $gt: new Date() },
  });
  console.log(user, 'user');

  if (!user) {
    throw new Error('Invalid or expired verification code');
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  return user;
};

const resendOTP = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.verificationCode = verificationCode;
  user.verificationCodeExpires = verificationCodeExpires;
  await user.save();

  console.log({ ...user.toObject(), verificationCode }, 'result service');

  // Send the code via Email
  try {
    await sendEmail(
      email,
      'Resend Verification Code',
      `<h1>Verification Code</h1><p>Your new code is <strong>${verificationCode}</strong>. It expires in 10 minutes.</p>`,
    );
  } catch (error) {
    console.error('Email resending failed:', error);
  }

  return {
    message: 'Verification code resent successfully',
    verificationCode, // Added for practice purpose
  };
};

const loginUser = async (payload: any) => {
  console.log('loginUser payload:', payload);
  // Hard-coded Admin Check
  if (payload.email === 'rmkayesur@gmail.com' && payload.password === 'rmkayesur') {
    let adminUser = await User.findOne({ email: payload.email });
    if (!adminUser) {
      // Create admin user if it doesn't exist
      adminUser = await User.create({
        name: 'Admin',
        email: payload.email,
        password: payload.password, // Will be hashed by pre-save hook
        phone: '00000000000',
        role: 'admin',
        isVerified: true
      });
    }
    
    const accessToken = jwt.sign(
      { userId: adminUser._id.toString(), role: 'admin' },
      config.jwt_access_secret as string,
      { expiresIn: config.jwt_access_expires_in as any },
    );
    return { accessToken, user: adminUser };
  }

  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordMatched = await bcryptjs.compare(
    payload.password,
    user.password as string,
  );

  if (!isPasswordMatched) {
    throw new Error('Invalid password');
  }

  const accessToken = jwt.sign(
    { userId: user._id.toString(), role: user.role },
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in as any },
  );

  return { accessToken, user };
};

export const AuthService = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
};
