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
    const rideData = { ...req.body, rider: req.user.userId };
    const result = await ride_service_1.RideService.createRideIntoDB(rideData);
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
const acceptRide = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const driverId = req.user.userId;
    const result = await ride_service_1.RideService.acceptRideRequest(id, driverId);
    if (result) {
        const io = (0, socket_io_1.getIo)();
        io.to(id).emit('ride-accepted', result);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Ride accepted successfully',
        data: result,
    });
});
exports.RideController = {
    createRide,
    getAllRides,
    getSingleRide,
    updateRide,
    acceptRide,
};
