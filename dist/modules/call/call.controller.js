"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const call_service_1 = require("./call.service");
const startCall = (0, catchAsync_1.default)(async (req, res) => {
    const result = await call_service_1.CallService.startCall(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Call started successfully',
        data: result,
    });
});
const endCall = (0, catchAsync_1.default)(async (req, res) => {
    const { callId, duration } = req.body;
    const result = await call_service_1.CallService.endCall(callId, duration);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Call ended successfully',
        data: result,
    });
});
const getMyCallLogs = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await call_service_1.CallService.getCallLogsForUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Call logs retrieved successfully',
        data: result,
    });
});
exports.CallController = {
    startCall,
    endCall,
    getMyCallLogs,
};
