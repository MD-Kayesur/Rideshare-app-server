import { Complaint, TComplaint } from './complaint.model';

const createComplaint = async (userId: string, payload: Partial<TComplaint>) => {
  const result = await Complaint.create({ ...payload, user: userId });
  return result;
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
