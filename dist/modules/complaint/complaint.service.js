"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintService = void 0;
const notification_service_1 = require("../notification/notification.service");
const complaint_model_1 = require("./complaint.model");
const createComplaint = async (userId, payload) => {
    const result = await complaint_model_1.Complaint.create({ ...payload, user: userId });
    // Create admin notification
    const notification = await notification_service_1.NotificationService.createNotification({
        title: 'New Complaint Received',
        message: `A new complaint has been filed by a user: "${payload.subject}"`,
        type: 'complaint',
        metadata: { userId } // Store the user ID for chat redirection
    });
    return { result, notification };
};
const getAllComplaints = async () => {
    return await complaint_model_1.Complaint.find().populate('user').sort({ createdAt: -1 });
};
const resolveComplaint = async (complaintId) => {
    const result = await complaint_model_1.Complaint.findByIdAndUpdate(complaintId, { isResolved: true }, { new: true });
    return result;
};
exports.ComplaintService = {
    createComplaint,
    getAllComplaints,
    resolveComplaint,
};
