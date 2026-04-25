import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcryptjs from 'bcryptjs';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['rider', 'driver', 'admin'], default: 'rider' },
    avatar: { type: String },
    rating: { type: Number, default: 5 },
    isVerified: { type: Boolean, default: false },
    currentLocation: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcryptjs.hash(
    user.password as string,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

export const User = model<TUser>('User', userSchema);
