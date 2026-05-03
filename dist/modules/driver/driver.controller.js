"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const driver_service_1 = require("./driver.service");
const createDriver = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await driver_service_1.DriverService.createDriver(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Driver profile created successfully',
        data: result,
    });
});
const getMyDriverProfile = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await driver_service_1.DriverService.getDriverByUserId(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Driver profile fetched successfully',
        data: result,
    });
});
const updateDriver = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await driver_service_1.DriverService.updateDriver(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Driver profile updated successfully',
        data: result,
    });
});
const getDriverById = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.params;
    const result = await driver_service_1.DriverService.getDriverByUserId(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Driver profile fetched successfully',
        data: result,
    });
});
const getAllDrivers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await driver_service_1.DriverService.getAllDrivers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All drivers fetched successfully',
        data: result,
    });
});
const getNearbyDrivers = (0, catchAsync_1.default)(async (req, res) => {
    const { lat, lng, vehicleType } = req.query;
    if (!lat || !lng) {
        throw new Error('Latitude and longitude are required');
    }
    const result = await driver_service_1.DriverService.getNearbyDrivers(Number(lat), Number(lng), vehicleType);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Nearby drivers fetched successfully',
        data: result,
    });
});
const getPendingDrivers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await driver_service_1.DriverService.getPendingDrivers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Pending drivers fetched successfully',
        data: result,
    });
});
const verifyDriver = (0, catchAsync_1.default)(async (req, res) => {
    const { driverId } = req.params;
    const result = await driver_service_1.DriverService.verifyDriver(driverId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Driver verified successfully',
        data: result,
    });
});
exports.DriverController = {
    createDriver,
    getMyDriverProfile,
    updateDriver,
    getDriverById,
    getAllDrivers,
    getNearbyDrivers,
    getPendingDrivers,
    verifyDriver,
};
