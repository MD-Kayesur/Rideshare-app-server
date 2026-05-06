import { NotificationService } from '../notification/notification.service';
import { Complaint, TComplaint } from './complaint.model';

const createComplaint = async (userId: string, payload: Partial<TComplaint>) => {
  const result = await Complaint.create({ ...payload, user: userId });
  
  // Create admin notification
  const notification = await NotificationService.createNotification({
    title: 'New Complaint Received',
    message: `A new complaint has been filed by a user: "${payload.subject}"`,
    type: 'complaint',
    metadata: { userId } // Store the user ID for chat redirection
  });

  return { result, notification };
};

const getAllComplaints = async () => {
  return await Complaint.find().populate('user').sort({ createdAt: -1 });
};

const resolveComplaint = async (complaintId: string) => {
  const result = await Complaint.findByIdAndUpdate(
    complaintId,
    { isResolved: true },
    { new: true }
  );
  return result;
};

export const ComplaintService = {
  createComplaint,
  getAllComplaints,
  resolveComplaint,
};
