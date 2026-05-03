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
  isOnline?: boolean; // For drivers
  isBanned?: boolean; // For admin control
  favouriteLocations?: {
    name: string;
    address: string;
    coordinates: number[];
  }[];
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
};
