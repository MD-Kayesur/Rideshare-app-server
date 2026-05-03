import { Notification } from './notification.model';

const getAllNotifications = async () => {
  return await Notification.find().sort({ createdAt: -1 });
};

const markAsRead = async (id: string) => {
  return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
};

const createNotification = async (payload: { title: string; message: string; type: 'complaint' | 'driver_request' }) => {
  return await Notification.create(payload);
};

export const NotificationService = {
  getAllNotifications,
  markAsRead,
  createNotification,
};
