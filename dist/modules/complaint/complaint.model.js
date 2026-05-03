"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Complaint = void 0;
const mongoose_1 = require("mongoose");
const complaintSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
}, { timestamps: true });
exports.Complaint = (0, mongoose_1.model)('Complaint', complaintSchema);
