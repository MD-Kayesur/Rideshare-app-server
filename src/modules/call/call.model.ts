import { Schema, model, Types } from 'mongoose';

export type TCallLog = {
  caller: Types.ObjectId;
  receiver: Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'missed' | 'completed' | 'ongoing' | 'cancelled';
  type: 'voice' | 'video';
};

const callLogSchema = new Schema<TCallLog>(
  {
    caller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number },
    status: {
      type: String,
      enum: ['missed', 'completed', 'ongoing', 'cancelled'],
      default: 'ongoing',
    },
    type: { type: String, enum: ['voice', 'video'], default: 'voice' },
  },
  { timestamps: true },
);

export const CallLog = model<TCallLog>('CallLog', callLogSchema);
