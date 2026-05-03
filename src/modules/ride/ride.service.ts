import QueryBuilder from '../../builder/QueryBuilder';
import { TRide } from './ride.interface';
import { Ride } from './ride.model';
import { Driver } from '../driver/driver.model';
import { User } from '../user/user.model';
import { RideSearchableFields } from './ride.constant';

const createRideIntoDB = async (payload: TRide) => {
  const result = await Ride.create(payload);
  return result;
};

const getAllRidesFromDB = async (query: Record<string, unknown>) => {
  const rideQuery = new QueryBuilder(Ride.find().populate('rider driver'), query)
    .search(RideSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await rideQuery.modelQuery;
  const meta = await rideQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleRideFromDB = async (id: string) => {
  const result = await Ride.findById(id).populate('rider driver');
  return result;
};

const updateRideIntoDB = async (id: string, payload: Partial<TRide>) => {
  const result = await Ride.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const acceptRideRequest = async (rideId: string, driverId: string) => {
  const result = await Ride.findByIdAndUpdate(
    rideId,
    { driver: driverId, status: 'accepted' },
    { new: true },
  );
  return result;
};

const startRide = async (rideId: string, otp: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new Error('Ride not found');
  if (ride.otp !== otp) throw new Error('Invalid OTP');

  const result = await Ride.findByIdAndUpdate(
    rideId,
    { status: 'ongoing' },
    { new: true },
  );
  return result;
};

const completeRide = async (rideId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new Error('Ride not found');

  const result = await Ride.findByIdAndUpdate(
    rideId,
    { status: 'completed', paymentStatus: 'paid' },
    { new: true },
  );

  // Update driver earnings and total rides
  if (ride.driver) {
    await Driver.findOneAndUpdate(
      { user: ride.driver },
      { 
        $inc: { totalEarnings: ride.fare, totalRides: 1 },
        isAvailable: true 
      }
    );
  }

  return result;
};

const cancelRide = async (rideId: string) => {
  const result = await Ride.findByIdAndUpdate(
    rideId,
    { status: 'cancelled' },
    { new: true },
  );
  
  // Make driver available again if cancelled
  const ride = await Ride.findById(rideId);
  if (ride?.driver) {
    await Driver.findOneAndUpdate({ user: ride.driver }, { isAvailable: true });
  }

  return result;
};

const findNearbyDrivers = async (longitude: number, latitude: number, rideType: string) => {
  const drivers = await User.find({
    role: 'driver',
    isOnline: true,
    currentLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: 5000, // 5km
      },
    },
  }).select('_id name avatar phone currentLocation');

  // Filter by vehicle type in Driver collection
  const driverIds = drivers.map(d => d._id);
  const eligibleDrivers = await Driver.find({
    user: { $in: driverIds },
    vehicleType: rideType,
    isAvailable: true,
    isVerified: true
  }).populate('user');

  return eligibleDrivers;
};

const rateRide = async (rideId: string, rating: number, feedback: string, ratedBy: string) => {
  const ride = await Ride.findById(rideId).populate('rider driver');
  if (!ride) throw new Error('Ride not found');

  // If rated by rider, update driver's rating
  if (ratedBy === ride.rider.toString()) {
    if (ride.driver) {
      const driver = await Driver.findOne({ user: ride.driver });
      if (driver) {
        const newRating = (driver.rating * driver.totalRides + rating) / (driver.totalRides + 1);
        await Driver.findOneAndUpdate({ user: ride.driver }, { rating: newRating });
      }
    }
  } else if (ratedBy === ride.driver?.toString()) {
    // If rated by driver, update rider's rating
    const rider = await User.findById(ride.rider);
    if (rider) {
      const currentRating = rider.rating || 5;
      // For simplicity, we assume rider has a total trips count or use a default
      const newRating = (currentRating + rating) / 2; 
      await User.findByIdAndUpdate(ride.rider, { rating: newRating });
    }
  }

  return await Ride.findByIdAndUpdate(
    rideId,
    { feedback, rating },
    { new: true }
  );
};

export const RideService = {
  createRideIntoDB,
  getAllRidesFromDB,
  getSingleRideFromDB,
  updateRideIntoDB,
  acceptRideRequest,
  startRide,
  completeRide,
  cancelRide,
  findNearbyDrivers,
  rateRide,
};
