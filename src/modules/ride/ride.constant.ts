export const RideStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const RideSearchableFields = ['pickupLocation.address', 'destinationLocation.address', 'status'];
