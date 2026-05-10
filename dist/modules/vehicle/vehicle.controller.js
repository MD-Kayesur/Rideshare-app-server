"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const vehicle_service_1 = require("./vehicle.service");
const addVehicle = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.user;
    const result = await vehicle_service_1.VehicleService.addVehicleIntoDB({
        ...req.body,
        driver: userId,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Vehicle added successfully',
        data: result,
    });
});
const getMyVehicles = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.user;
    const result = await vehicle_service_1.VehicleService.getMyVehiclesFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Vehicles retrieved successfully',
        data: result,
    });
});
const deleteVehicle = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await vehicle_service_1.VehicleService.deleteVehicleFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Vehicle deleted successfully',
        data: null,
    });
});
exports.VehicleController = {
    addVehicle,
    getMyVehicles,
    deleteVehicle,
};
