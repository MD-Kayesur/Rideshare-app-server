"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_model_1 = require("./user.model");
const vehicle_model_1 = require("../vehicle/vehicle.model");
const socket_io_1 = require("../../socket/socket.io");
const getAllUsersFromDB = async (query) => {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(['name', 'email', 'phone'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();
    return {
        meta,
        result,
    };
};
const getSingleUserFromDB = async (id) => {
    const result = await user_model_1.User.findById(id);
    return result;
};
const updateUserIntoDB = async (id, payload) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const deleteUserFromDB = async (id) => {
    const result = await user_model_1.User.findByIdAndDelete(id);
    return result;
};
const getMe = async (userId) => {
    const result = await user_model_1.User.findById(userId);
    return result;
};
const toggleOnlineStatus = async (userId, isOnline) => {
    const result = await user_model_1.User.findByIdAndUpdate(userId, { isOnline }, { new: true });
    if (result) {
        // Synchronize vehicle AC status with online status for testing/convenience
        await vehicle_model_1.Vehicle.updateMany({ driver: userId }, { $set: { 'details.isAC': isOnline } });
        // Notify all riders that a driver status has changed
        const io = (0, socket_io_1.getIo)();
        io.emit('driver_status_changed', { driverId: userId, isOnline });
    }
    return result;
};
const updateLocation = async (userId, longitude, latitude) => {
    const result = await user_model_1.User.findByIdAndUpdate(userId, {
        currentLocation: {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
    }, { new: true });
    return result;
};
const banUser = async (userId, isBanned) => {
    const result = await user_model_1.User.findByIdAndUpdate(userId, { isBanned }, { new: true });
    return result;
};
exports.UserService = {
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
    getMe,
    toggleOnlineStatus,
    updateLocation,
    banUser,
};
