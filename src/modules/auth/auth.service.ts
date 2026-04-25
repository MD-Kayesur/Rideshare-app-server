import { User } from '../user/user.model';
import { TUser } from '../user/user.interface';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

const registerUser = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: any) => {
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
  loginUser,
};
