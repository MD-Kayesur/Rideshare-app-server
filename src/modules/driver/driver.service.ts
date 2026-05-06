import { TDriver } from './driver.interface';
import { Driver } from './driver.model';
import { User } from '../user/user.model';
import { Vehicle } from '../vehicle/vehicle.model';

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
  // 1. Find users with role 'driver' within radius (e.g., 5km) who are ONLINE
  const nearbyUsers = await User.find({
    role: 'driver',
    isOnline: true,
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: 500000, // 500 kilometers for testing
      },
    },
  });

  if (!nearbyUsers.length) return [];

  const userIds = nearbyUsers.map(user => user._id);

  // 2. Find driver profiles for these active users
  const activeDrivers = await Driver.find({ 
    user: { $in: userIds }
  });
  
  const activeDriverUserIds = activeDrivers.map(d => d.user.toString());

  // 3. Find ALL vehicles belonging to these active, online drivers
  const vehicleQuery: any = { 
    driver: { $in: activeDriverUserIds } 
  };
  
  if (vehicleType) {
    vehicleQuery.vehicleType = vehicleType;
  }

  // Show all vehicles for now (ignoring verification for testing)
  const vehicles = await Vehicle.find(vehicleQuery).populate('driver');
  
  return vehicles.map(vehicle => {
    const user = nearbyUsers.find(u => u._id.toString() === (vehicle.driver as any)._id.toString());
    return {
      _id: vehicle._id,
      vehicleModel: vehicle.vehicleModel,
      vehicleType: vehicle.vehicleType,
      vehicleImage: vehicle.vehicleImage,
      vehicleNumber: vehicle.vehicleNumber,
      details: vehicle.details,
      user: vehicle.driver, // Match front-end expectation
      distance: 'Nearby', 
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
