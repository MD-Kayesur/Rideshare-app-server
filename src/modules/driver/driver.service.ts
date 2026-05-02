import { TDriver } from './driver.interface';
import { Driver } from './driver.model';
import { User } from '../user/user.model';

const createDriver = async (userId: string, payload: Partial<TDriver>) => {
  // Ensure user exists and has driver role
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (user.role !== 'driver') throw new Error('User must have driver role to create a profile');

  // Check if driver already exists
  const existingDriver = await Driver.findOne({ user: userId });
  if (existingDriver) throw new Error('Driver profile already exists');

  const result = await Driver.create({
    ...payload,
    user: userId,
  });
  return result;
};

const getDriverByUserId = async (userId: string) => {
  const result = await Driver.findOne({ user: userId }).populate('user');
  return result;
};

const updateDriver = async (userId: string, payload: Partial<TDriver>) => {
  const result = await Driver.findOneAndUpdate(
    { user: userId },
    payload,
    { new: true, runValidators: true }
  );
  if (!result) throw new Error('Driver profile not found');
  return result;
};

const deleteDriver = async (userId: string) => {
  const result = await Driver.findOneAndDelete({ user: userId });
  if (!result) throw new Error('Driver profile not found');
  return result;
};

const getAllDrivers = async () => {
  return await Driver.find().populate('user');
};

export const DriverService = {
  createDriver,
  getDriverByUserId,
  updateDriver,
  deleteDriver,
  getAllDrivers,
};
