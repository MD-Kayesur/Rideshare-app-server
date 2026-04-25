"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const ride_controller_1 = require("./ride.controller");
const ride_validation_1 = require("./ride.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)('rider'), (0, validateRequest_1.default)(ride_validation_1.RideValidation.createRideValidationSchema), ride_controller_1.RideController.createRide);
router.get('/', (0, auth_1.default)('admin', 'driver', 'rider'), ride_controller_1.RideController.getAllRides);
router.get('/:id', (0, auth_1.default)('admin', 'driver', 'rider'), ride_controller_1.RideController.getSingleRide);
router.patch('/:id', (0, auth_1.default)('admin', 'driver', 'rider'), (0, validateRequest_1.default)(ride_validation_1.RideValidation.updateRideStatusValidationSchema), ride_controller_1.RideController.updateRide);
router.patch('/:id/accept', (0, auth_1.default)('driver'), ride_controller_1.RideController.acceptRide);
exports.RideRoutes = router;
