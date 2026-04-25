"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallService = void 0;
const call_model_1 = require("./call.model");
const startCall = async (payload) => {
    const result = await call_model_1.CallLog.create(payload);
    return result;
};
const endCall = async (callId, duration) => {
    const result = await call_model_1.CallLog.findByIdAndUpdate(callId, { endTime: new Date(), duration, status: 'completed' }, { new: true });
    return result;
};
const getCallLogsForUser = async (userId) => {
    const result = await call_model_1.CallLog.find({
        $or: [{ caller: userId }, { receiver: userId }],
    }).populate('caller receiver');
    return result;
};
exports.CallService = {
    startCall,
    endCall,
    getCallLogsForUser,
};
