import { getIo } from '../../socket/socket.io';
import { Notification } from './notification.model';

const getAllNotifications = async () => {
  return await Notification.find().sort({ createdAt: -1 });
};

const getNotificationsForUser = async (userId: string) => {
  return await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
};

const markAsRead = async (id: string) => {
  return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
};

const createNotification = async (payload: { 
  recipient?: string; 
  title: string; 
  message: string; 
  type: string;
  metadata?: Record<string, any>;
}) => {
  const result = await Notification.create(payload);
  
  const io = getIo();
  if (payload.recipient) {
    // Send to specific user room
    io.to(payload.recipient).emit('notification', result);
  } else {
    // Send to admin room only
    io.to('admin').emit('admin-notification', result);
  }
  
  return result;
};

const deleteNotification = async (id: string) => {
  return await Notification.findByIdAndDelete(id);
};

const deleteAllNotifications = async () => {
  return await Notification.deleteMany({});
};

export const NotificationService = {
  getAllNotifications,
  getNotificationsForUser,
  markAsRead,
  createNotification,
  deleteNotification,
  deleteAllNotifications,
};
