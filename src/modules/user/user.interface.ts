export type TUserRole = 'rider' | 'driver' | 'admin';

export type TUser = {
  name: string;
  email: string;
  password?: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  role: TUserRole;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  avatar?: string;
  rating?: number;
  isVerified?: boolean;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
};
