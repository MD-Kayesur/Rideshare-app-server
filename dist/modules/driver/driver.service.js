"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const driver_model_1 = require("./driver.model");
const user_model_1 = require("../user/user.model");
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
    // 1. Find users with role 'driver' within radius (e.g., 5km)
    const nearbyUsers = await user_model_1.User.find({
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
    if (!nearbyUsers.length)
        return [];
    // 2. Find their corresponding driver profiles
    const userIds = nearbyUsers.map(user => user._id);
    const query = { user: { $in: userIds }, isVerified: true }; // Only verified drivers
    if (vehicleType) {
        query.vehicleType = vehicleType;
    }
    const drivers = await driver_model_1.Driver.find(query).populate('user');
    // Combine user location with driver profile
    return drivers.map(driver => {
        const user = nearbyUsers.find(u => u._id.toString() === driver.user._id.toString());
        return {
            ...driver.toObject(),
            distance: user ? 'Nearby' : 'Unknown', // In a real app, calculate actual distance
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
