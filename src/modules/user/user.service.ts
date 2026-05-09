import QueryBuilder from '../../builder/QueryBuilder';
import { TUser } from './user.interface';
import { User } from './user.model';
import { Vehicle } from '../vehicle/vehicle.model';
import { getIo } from '../../socket/socket.io';

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(['name', 'email', 'phone'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

const getMe = async (userId: string) => {
  const result = await User.findById(userId);
  return result;
};

const toggleOnlineStatus = async (userId: string, isOnline: boolean) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { isOnline },
    { new: true }
  );

  if (result) {
    // Synchronize vehicle AC status with online status for testing/convenience
    await Vehicle.updateMany(
      { driver: userId },
      { $set: { 'details.isAC': isOnline } }
    );

    // Notify all riders that a driver status has changed
    const io = getIo();
    io.emit('driver_status_changed', { driverId: userId, isOnline });
  }

  return result;
};

const updateLocation = async (userId: string, longitude: number, latitude: number) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { 
      currentLocation: { 
        type: 'Point', 
        coordinates: [longitude, latitude] 
      } 
    },
    { new: true }
  );
  return result;
};

const banUser = async (userId: string, isBanned: boolean) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { isBanned },
    { new: true }
  );
  return result;
};

export const UserService = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getMe,
  toggleOnlineStatus,
  updateLocation,
  banUser,
};
