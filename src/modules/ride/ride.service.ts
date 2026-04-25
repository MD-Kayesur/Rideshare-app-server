import QueryBuilder from '../../builder/QueryBuilder';
import { TRide } from './ride.interface';
import { Ride } from './ride.model';
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

export const RideService = {
  createRideIntoDB,
  getAllRidesFromDB,
  getSingleRideFromDB,
  updateRideIntoDB,
  acceptRideRequest,
};
