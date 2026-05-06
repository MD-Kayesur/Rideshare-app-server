import { TVehicle } from './vehicle.interface';
import { Vehicle } from './vehicle.model';

const addVehicleIntoDB = async (payload: TVehicle) => {
  const result = await Vehicle.create(payload);
  return result;
};

const getMyVehiclesFromDB = async (driverId: string) => {
  const result = await Vehicle.find({ driver: driverId });
  return result;
};

const deleteVehicleFromDB = async (id: string) => {
  const result = await Vehicle.findByIdAndDelete(id);
  return result;
};

const updateVehicleInDB = async (id: string, payload: Partial<TVehicle>) => {
  const result = await Vehicle.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const VehicleService = {
  addVehicleIntoDB,
  getMyVehiclesFromDB,
  deleteVehicleFromDB,
  updateVehicleInDB,
};
