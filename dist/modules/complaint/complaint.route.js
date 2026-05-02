"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const complaint_controller_1 = require("./complaint.controller");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)('rider', 'driver', 'admin'), complaint_controller_1.ComplaintController.createComplaint);
router.get('/', (0, auth_1.default)('admin'), complaint_controller_1.ComplaintController.getAllComplaints);
router.patch('/resolve/:complaintId', (0, auth_1.default)('admin'), complaint_controller_1.ComplaintController.resolveComplaint);
exports.ComplaintRoutes = router;
