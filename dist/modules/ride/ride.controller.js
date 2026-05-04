"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ride_service_1 = require("./ride.service");
const socket_io_1 = require("../../socket/socket.io");
const createRide = (0, catchAsync_1.default)(async (req, res) => {
    const { pickupLocation, rideType } = req.body;
    const riderId = req.user.userId;
    // 1. Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const rideData = { ...req.body, rider: riderId, otp };
    const result = await ride_service_1.RideService.createRideIntoDB(rideData);
    // 2. Notify nearby drivers
    const nearbyDrivers = await ride_service_1.RideService.findNearbyDrivers(pickupLocation.coordinates[0], pickupLocation.coordinates[1], rideType);
    const io = (0, socket_io_1.getIo)();
    nearbyDrivers.forEach((driver) => {
        io.to(driver.user?._id.toString()).emit('new-ride-request', result);
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Ride requested successfully',
        data: result,
    });
});
const getAllRides = (0, catchAsync_1.default)(async (req, res) => {
    const result = await ride_service_1.RideService.getAllRidesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Rides are retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});
const getSingleRide = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await ride_service_1.RideService.getSingleRideFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Ride is retrieved successfully',
        data: result,
    });
});
const updateRide = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await ride_service_1.RideService.updateRideIntoDB(id, req.body);
    if (result) {
        const io = (0, socket_io_1.getIo)();
        io.to(id).emit('ride-updated', result);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Ride is updated successfully',
        data: result,
    });
});
const acceptRideRequest = (0, catchAsync_1.default)(async (req, res) => {
    const { rideId } = req.params;
    const driverId = req.user.userId;
    const result = await ride_service_1.RideService.acceptRideRequest(rideId, driverId);
    if (result) {
        const io = (0, socket_io_1.getIo)();
        io.to(rideId).emit('ride-accepted', result);
        io.to(result.rider.toString()).emit('your-ride-accepted', result);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Ride accepted successfully',
        data: result,
    });
});
const startRide = (0, catchAsync_1.default)(async (req, res) => {
    const { rideId } = req.params;
    const { otp } = req.body;
    const result = await ride_service_1.RideService.startRide(rideId, otp);
    if (result) {
        const io = (0, socket_io_1.getIo)();
        io.to(rideId).emit('ride-started', result);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Ride started successfully',
        data: result,
    });
});
const completeRide = (0, catchAsync_1.default)(async (req, res) => {
    const { rideId } = req.params;
    const result = await ride_service_1.RideService.completeRide(rideId);
    if (result) {
        const io = (0, socket_io_1.getIo)();
        io.to(rideId).emit('ride-completed', result);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Ride completed successfully',
        data: result,
    });
});
const cancelRide = (0, catchAsync_1.default)(async (req, res) => {
    const { rideId } = req.params;
    const result = await ride_service_1.RideService.cancelRide(rideId);
    if (result) {
        const io = (0, socket_io_1.getIo)();
        io.to(rideId).emit('ride-cancelled', result);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Ride cancelled successfully',
        data: result,
    });
});
const rateRide = (0, catchAsync_1.default)(async (req, res) => {
    const { rideId } = req.params;
    const { rating, feedback } = req.body;
    const ratedBy = req.user.userId;
    const result = await ride_service_1.RideService.rateRide(rideId, rating, feedback, ratedBy);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Ride rated successfully',
        data: result,
    });
});
exports.RideController = {
    createRide,
    getAllRides,
    getSingleRide,
    updateRide,
    acceptRideRequest,
    startRide,
    completeRide,
    cancelRide,
    rateRide,
};
