import { CallLog, TCallLog } from './call.model';

const startCall = async (payload: Partial<TCallLog>) => {
  const result = await CallLog.create(payload);
  return result;
};

const endCall = async (callId: string, duration: number) => {
  const result = await CallLog.findByIdAndUpdate(
    callId,
    { endTime: new Date(), duration, status: 'completed' },
    { new: true },
  );
  return result;
};

const getCallLogsForUser = async (userId: string) => {
  const result = await CallLog.find({
    $or: [{ caller: userId }, { receiver: userId }],
  }).populate('caller receiver');
  return result;
};

export const CallService = {
  startCall,
  endCall,
  getCallLogsForUser,
};
