"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const vehicle_model_1 = require("./vehicle.model");
const addVehicleIntoDB = async (payload) => {
    const result = await vehicle_model_1.Vehicle.create(payload);
    return result;
};
const getMyVehiclesFromDB = async (driverId) => {
    const result = await vehicle_model_1.Vehicle.find({ driver: driverId });
    return result;
};
const deleteVehicleFromDB = async (id) => {
    const result = await vehicle_model_1.Vehicle.findByIdAndDelete(id);
    return result;
};
const updateVehicleInDB = async (id, payload) => {
    const result = await vehicle_model_1.Vehicle.findByIdAndUpdate(id, payload, { new: true });
    return result;
};
exports.VehicleService = {
    addVehicleIntoDB,
    getMyVehiclesFromDB,
    deleteVehicleFromDB,
    updateVehicleInDB,
};
