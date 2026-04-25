"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLog = void 0;
const mongoose_1 = require("mongoose");
const callLogSchema = new mongoose_1.Schema({
    caller: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number },
    status: {
        type: String,
        enum: ['missed', 'completed', 'ongoing', 'cancelled'],
        default: 'ongoing',
    },
    type: { type: String, enum: ['voice', 'video'], default: 'voice' },
}, { timestamps: true });
exports.CallLog = (0, mongoose_1.model)('CallLog', callLogSchema);
