"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.getAllUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users are retrieved successfully',
        meta: result.meta,
        data: result.result,
    });
});
const getSingleUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserService.getSingleUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is retrieved successfully',
        data: result,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserService.updateUserIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is updated successfully',
        data: result,
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserService.deleteUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is deleted successfully',
        data: result,
    });
});
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.user;
    const result = await user_service_1.UserService.getMe(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User profile is retrieved successfully',
        data: result,
    });
});
const toggleOnlineStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.user;
    const { isOnline } = req.body;
    const result = await user_service_1.UserService.toggleOnlineStatus(userId, isOnline);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Online status updated successfully',
        data: result,
    });
});
const updateLocation = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.user;
    const { longitude, latitude } = req.body;
    const result = await user_service_1.UserService.updateLocation(userId, longitude, latitude);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Location updated successfully',
        data: result,
    });
});
const banUser = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { isBanned } = req.body;
    const result = await user_service_1.UserService.banUser(id, isBanned);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
        data: result,
    });
});
exports.UserController = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getMe,
    toggleOnlineStatus,
    updateLocation,
    banUser,
};
