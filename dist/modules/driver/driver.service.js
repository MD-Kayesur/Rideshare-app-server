"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const driver_model_1 = require("./driver.model");
const user_model_1 = require("../user/user.model");
const vehicle_model_1 = require("../vehicle/vehicle.model");
const createDriver = async (userId, payload) => {
    // Ensure user exists and has driver role
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new Error('User not found');
    if (user.role !== 'driver')
        throw new Error('User must have driver role to create a profile');
    // Check if driver already exists
    const existingDriver = await driver_model_1.Driver.findOne({ user: userId });
    if (existingDriver)
        throw new Error('Driver profile already exists');
    const result = await driver_model_1.Driver.create({
        ...payload,
        user: userId,
    });
    return result;
};
const getDriverByUserId = async (userId) => {
    const result = await driver_model_1.Driver.findOne({ user: userId }).populate('user');
    return result;
};
const updateDriver = async (userId, payload) => {
    const result = await driver_model_1.Driver.findOneAndUpdate({ user: userId }, payload, { new: true, runValidators: true });
    if (!result)
        throw new Error('Driver profile not found');
    return result;
};
const deleteDriver = async (userId) => {
    const result = await driver_model_1.Driver.findOneAndDelete({ user: userId });
    if (!result)
        throw new Error('Driver profile not found');
    return result;
};
const getAllDrivers = async () => {
    return await driver_model_1.Driver.find().populate('user');
};
const getNearbyDrivers = async (lat, lng, vehicleType) => {
    // 1. Find users with role 'driver' within radius (e.g., 5km) who are ONLINE
    const nearbyUsers = await user_model_1.User.find({
        role: 'driver',
        isOnline: true,
        /*
        currentLocation: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: 500000,
          },
        },
        */
    });
    if (!nearbyUsers.length)
        return [];
    const userIds = nearbyUsers.map(user => user._id);
    // 2. Find driver profiles for these active users
    const activeDrivers = await driver_model_1.Driver.find({
        user: { $in: userIds }
    });
    const activeDriverUserIds = activeDrivers.map(d => d.user.toString());
    // 3. Find ALL vehicles belonging to these active, online drivers
    const vehicleQuery = {
        driver: { $in: activeDriverUserIds }
    };
    if (vehicleType) {
        vehicleQuery.vehicleType = vehicleType;
    }
    // Show all vehicles for now (ignoring verification for testing)
    const vehicles = await vehicle_model_1.Vehicle.find(vehicleQuery).populate('driver');
    console.log(`Found ${vehicles.length} vehicles for type: ${vehicleType}`);
    return vehicles.map(vehicle => {
        const user = nearbyUsers.find(u => u._id.toString() === vehicle.driver._id.toString());
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
    return await driver_model_1.Driver.find({ isVerified: false }).populate('user');
};
const verifyDriver = async (driverId) => {
    const result = await driver_model_1.Driver.findByIdAndUpdate(driverId, { isVerified: true }, { new: true }).populate('user');
    return result;
};
exports.DriverService = {
    createDriver,
    getDriverByUserId,
    updateDriver,
    deleteDriver,
    getAllDrivers,
    getNearbyDrivers,
    getPendingDrivers,
    verifyDriver,
};
