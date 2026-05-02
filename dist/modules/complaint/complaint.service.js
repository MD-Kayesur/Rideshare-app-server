"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintService = void 0;
const complaint_model_1 = require("./complaint.model");
const createComplaint = async (userId, payload) => {
    const result = await complaint_model_1.Complaint.create({ ...payload, user: userId });
    return result;
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
