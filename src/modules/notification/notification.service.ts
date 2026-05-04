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
  metadata?: any;
}) => {
  const result = await Notification.create(payload);
  
  const io = getIo();
  if (payload.recipient) {
    // Send to specific user room
    io.to(payload.recipient).emit('notification', result);
  } else {
    // Send to admin room
    io.emit('admin-notification', result);
  }
  
  return result;
};

export const NotificationService = {
  getAllNotifications,
  getNotificationsForUser,
  markAsRead,
  createNotification,
};
