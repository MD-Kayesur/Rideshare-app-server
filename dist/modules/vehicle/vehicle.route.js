"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const vehicle_controller_1 = require("./vehicle.controller");
const router = express_1.default.Router();
router.post('/add', (0, auth_1.default)('driver'), vehicle_controller_1.VehicleController.addVehicle);
router.get('/my-vehicles', (0, auth_1.default)('driver'), vehicle_controller_1.VehicleController.getMyVehicles);
router.delete('/:id', (0, auth_1.default)('driver'), vehicle_controller_1.VehicleController.deleteVehicle);
exports.VehicleRoutes = router;
