import express from 'express';
import { CallController } from './call.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/start', auth('rider', 'driver'), CallController.startCall);
router.post('/end', auth('rider', 'driver'), CallController.endCall);
router.get('/my-logs', auth('rider', 'driver'), CallController.getMyCallLogs);

export const CallRoutes = router;
