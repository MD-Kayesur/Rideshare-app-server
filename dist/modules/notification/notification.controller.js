"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const notification_service_1 = require("./notification.service");
const getAllNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const result = await notification_service_1.NotificationService.getAllNotifications();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notifications fetched successfully',
        data: result,
    });
});
const markAsRead = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await notification_service_1.NotificationService.markAsRead(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification marked as read',
        data: result,
    });
});
const getMyNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    const result = await notification_service_1.NotificationService.getNotificationsForUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My notifications fetched successfully',
        data: result,
    });
});
const deleteNotification = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await notification_service_1.NotificationService.deleteNotification(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification deleted successfully',
        data: result,
    });
});
const deleteAllNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const result = await notification_service_1.NotificationService.deleteAllNotifications();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All notifications deleted successfully',
        data: result,
    });
});
exports.NotificationController = {
    getAllNotifications,
    markAsRead,
    getMyNotifications,
    deleteNotification,
    deleteAllNotifications,
};
