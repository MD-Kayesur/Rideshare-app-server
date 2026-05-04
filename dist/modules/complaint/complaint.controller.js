"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const complaint_service_1 = require("./complaint.service");
const socket_io_1 = require("../../socket/socket.io");
const createComplaint = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const { result, notification } = await complaint_service_1.ComplaintService.createComplaint(userId, req.body);
    // Emit real-time notification to admin
    const io = (0, socket_io_1.getIo)();
    io.emit('admin-notification', notification);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Complaint submitted successfully',
        data: result,
    });
});
const getAllComplaints = (0, catchAsync_1.default)(async (req, res) => {
    const result = await complaint_service_1.ComplaintService.getAllComplaints();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All complaints fetched successfully',
        data: result,
    });
});
const resolveComplaint = (0, catchAsync_1.default)(async (req, res) => {
    const { complaintId } = req.params;
    const result = await complaint_service_1.ComplaintService.resolveComplaint(complaintId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Complaint resolved successfully',
        data: result,
    });
});
exports.ComplaintController = {
    createComplaint,
    getAllComplaints,
    resolveComplaint,
};
