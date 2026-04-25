"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallRoutes = void 0;
const express_1 = __importDefault(require("express"));
const call_controller_1 = require("./call.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/start', (0, auth_1.default)('rider', 'driver'), call_controller_1.CallController.startCall);
router.post('/end', (0, auth_1.default)('rider', 'driver'), call_controller_1.CallController.endCall);
router.get('/my-logs', (0, auth_1.default)('rider', 'driver'), call_controller_1.CallController.getMyCallLogs);
exports.CallRoutes = router;
