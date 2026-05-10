"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const createPaymentIntent = (0, catchAsync_1.default)(async (req, res) => {
    const { rideId, gateway } = req.body;
    const result = await payment_service_1.PaymentService.createPaymentIntent(rideId, gateway);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Payment intent created successfully',
        data: result,
    });
});
const verifyPayment = (0, catchAsync_1.default)(async (req, res) => {
    const { transactionId } = req.query;
    const result = await payment_service_1.PaymentService.validatePayment(transactionId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment verified successfully',
        data: result,
    });
});
const getMyPayments = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user._id;
    const result = await payment_service_1.PaymentService.getMyPayments(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment history fetched successfully',
        data: result,
    });
});
exports.PaymentController = {
    createPaymentIntent,
    verifyPayment,
    getMyPayments,
};
