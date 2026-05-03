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

const getNearbyDrivers = async (lat: number, lng: number, vehicleType?: string) => {
  // 1. Find users with role 'driver' within radius (e.g., 5km)
  const nearbyUsers = await User.find({
    role: 'driver',
    isOnline: true,
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: 5000, // 5 kilometers
      },
    },
  });

  if (!nearbyUsers.length) return [];

  // 2. Find their corresponding driver profiles
  const userIds = nearbyUsers.map(user => user._id);
  const query: any = { user: { $in: userIds }, isVerified: true }; // Only verified drivers
  if (vehicleType) {
    query.vehicleType = vehicleType;
  }

  const drivers = await Driver.find(query).populate('user');
  
  // Combine user location with driver profile
  return drivers.map(driver => {
    const user = nearbyUsers.find(u => u._id.toString() === (driver.user as any)._id.toString());
    return {
      ...driver.toObject(),
      distance: user ? 'Nearby' : 'Unknown', // In a real app, calculate actual distance
    };
  });
};

const getPendingDrivers = async () => {
  return await Driver.find({ isVerified: false }).populate('user');
};

const verifyDriver = async (driverId: string) => {
  const result = await Driver.findByIdAndUpdate(
    driverId,
    { isVerified: true },
    { new: true }
  ).populate('user');
  return result;
};

export const DriverService = {
  createDriver,
  getDriverByUserId,
  updateDriver,
  deleteDriver,
  getAllDrivers,
  getNearbyDrivers,
  getPendingDrivers,
  verifyDriver,
};
