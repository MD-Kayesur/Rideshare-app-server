"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const ride_model_1 = require("./ride.model");
const ride_constant_1 = require("./ride.constant");
const createRideIntoDB = async (payload) => {
    const result = await ride_model_1.Ride.create(payload);
    return result;
};
const getAllRidesFromDB = async (query) => {
    const rideQuery = new QueryBuilder_1.default(ride_model_1.Ride.find().populate('rider driver'), query)
        .search(ride_constant_1.RideSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await rideQuery.modelQuery;
    const meta = await rideQuery.countTotal();
    return {
        meta,
        result,
    };
};
const getSingleRideFromDB = async (id) => {
    const result = await ride_model_1.Ride.findById(id).populate('rider driver');
    return result;
};
const updateRideIntoDB = async (id, payload) => {
    const result = await ride_model_1.Ride.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const acceptRideRequest = async (rideId, driverId) => {
    const result = await ride_model_1.Ride.findByIdAndUpdate(rideId, { driver: driverId, status: 'accepted' }, { new: true });
    return result;
};
exports.RideService = {
    createRideIntoDB,
    getAllRidesFromDB,
    getSingleRideFromDB,
    updateRideIntoDB,
    acceptRideRequest,
};
