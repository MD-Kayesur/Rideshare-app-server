"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_model_1 = require("./user.model");
const getAllUsersFromDB = async (query) => {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(['name', 'email', 'phone'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();
    return {
        meta,
        result,
    };
};
const getSingleUserFromDB = async (id) => {
    const result = await user_model_1.User.findById(id);
    return result;
};
const updateUserIntoDB = async (id, payload) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const deleteUserFromDB = async (id) => {
    const result = await user_model_1.User.findByIdAndDelete(id);
    return result;
};
const getMe = async (userId) => {
    const result = await user_model_1.User.findById(userId);
    return result;
};
exports.UserService = {
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
    getMe,
};
