export type TUserRole = 'rider' | 'driver' | 'admin';

export type TUser = {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: TUserRole;
  avatar?: string;
  rating?: number;
  isVerified?: boolean;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
};
