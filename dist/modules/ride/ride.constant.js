"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideSearchableFields = exports.RideStatus = void 0;
exports.RideStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};
exports.RideSearchableFields = ['pickupLocation.address', 'destinationLocation.address', 'status'];
