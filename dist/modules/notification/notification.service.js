"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const socket_io_1 = require("../../socket/socket.io");
const notification_model_1 = require("./notification.model");
const getAllNotifications = async () => {
    return await notification_model_1.Notification.find().sort({ createdAt: -1 });
};
const getNotificationsForUser = async (userId) => {
    return await notification_model_1.Notification.find({ recipient: userId }).sort({ createdAt: -1 });
};
const markAsRead = async (id) => {
    return await notification_model_1.Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
};
const createNotification = async (payload) => {
    const result = await notification_model_1.Notification.create(payload);
    const io = (0, socket_io_1.getIo)();
    if (payload.recipient) {
        // Send to specific user room
        io.to(payload.recipient).emit('notification', result);
    }
    else {
        // Send to admin room only
        io.to('admin').emit('admin-notification', result);
    }
    return result;
};
const deleteNotification = async (id) => {
    return await notification_model_1.Notification.findByIdAndDelete(id);
};
const deleteAllNotifications = async () => {
    return await notification_model_1.Notification.deleteMany({});
};
exports.NotificationService = {
    getAllNotifications,
    getNotificationsForUser,
    markAsRead,
    createNotification,
    deleteNotification,
    deleteAllNotifications,
};
