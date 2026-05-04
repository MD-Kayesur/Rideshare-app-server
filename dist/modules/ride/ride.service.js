"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const ride_model_1 = require("./ride.model");
const driver_model_1 = require("../driver/driver.model");
const user_model_1 = require("../user/user.model");
const ride_constant_1 = require("./ride.constant");
const createRideIntoDB = async (payload) => {
    const result = await ride_model_1.Ride.create(payload);
    return result;
};
const getAllRidesFromDB = async (query) => {
    const rideQuery = new QueryBuilder_1.default(ride_model_1.Ride.find().populate('rider driver'), query)
        .search(ride_constant_1.RideSearchableFields)
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
const getSingleRideFromDB = async (id) => {
    const result = await ride_model_1.Ride.findById(id).populate('rider driver');
    return result;
};
const updateRideIntoDB = async (id, payload) => {
    const result = await ride_model_1.Ride.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const acceptRideRequest = async (rideId, driverId) => {
    const result = await ride_model_1.Ride.findByIdAndUpdate(rideId, { driver: driverId, status: 'accepted' }, { new: true });
    return result;
};
const startRide = async (rideId, otp) => {
    const ride = await ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new Error('Ride not found');
    if (ride.otp !== otp)
        throw new Error('Invalid OTP');
    const result = await ride_model_1.Ride.findByIdAndUpdate(rideId, { status: 'ongoing' }, { new: true });
    return result;
};
const completeRide = async (rideId) => {
    const ride = await ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new Error('Ride not found');
    const result = await ride_model_1.Ride.findByIdAndUpdate(rideId, { status: 'completed', paymentStatus: 'paid' }, { new: true });
    // Update driver earnings and total rides
    if (ride.driver) {
        await driver_model_1.Driver.findOneAndUpdate({ user: ride.driver }, {
            $inc: { totalEarnings: ride.fare, totalRides: 1 },
            isAvailable: true
        });
    }
    return result;
};
const cancelRide = async (rideId) => {
    const result = await ride_model_1.Ride.findByIdAndUpdate(rideId, { status: 'cancelled' }, { new: true });
    // Make driver available again if cancelled
    const ride = await ride_model_1.Ride.findById(rideId);
    if (ride?.driver) {
        await driver_model_1.Driver.findOneAndUpdate({ user: ride.driver }, { isAvailable: true });
    }
    return result;
};
const findNearbyDrivers = async (longitude, latitude, rideType) => {
    const drivers = await user_model_1.User.find({
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
    const eligibleDrivers = await driver_model_1.Driver.find({
        user: { $in: driverIds },
        vehicleType: rideType,
        isAvailable: true,
        isVerified: true
    }).populate('user');
    return eligibleDrivers;
};
const rateRide = async (rideId, rating, feedback, ratedBy) => {
    const ride = await ride_model_1.Ride.findById(rideId).populate('rider driver');
    if (!ride)
        throw new Error('Ride not found');
    // If rated by rider, update driver's rating
    if (ratedBy === ride.rider.toString()) {
        if (ride.driver) {
            const driver = await driver_model_1.Driver.findOne({ user: ride.driver });
            if (driver) {
                const newRating = (driver.rating * driver.totalRides + rating) / (driver.totalRides + 1);
                await driver_model_1.Driver.findOneAndUpdate({ user: ride.driver }, { rating: newRating });
            }
        }
    }
    else if (ratedBy === ride.driver?.toString()) {
        // If rated by driver, update rider's rating
        const rider = await user_model_1.User.findById(ride.rider);
        if (rider) {
            const currentRating = rider.rating || 5;
            // For simplicity, we assume rider has a total trips count or use a default
            const newRating = (currentRating + rating) / 2;
            await user_model_1.User.findByIdAndUpdate(ride.rider, { rating: newRating });
        }
    }
    return await ride_model_1.Ride.findByIdAndUpdate(rideId, { feedback, rating }, { new: true });
};
exports.RideService = {
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
