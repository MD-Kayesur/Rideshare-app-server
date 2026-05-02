import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ComplaintController } from './complaint.controller';

const router = Router();

router.post(
  '/',
  auth('rider', 'driver', 'admin'),
  ComplaintController.createComplaint
);

router.get(
  '/',
  auth('admin'),
  ComplaintController.getAllComplaints
);

router.patch(
  '/resolve/:complaintId',
  auth('admin'),
  ComplaintController.resolveComplaint
);

export const ComplaintRoutes = router;
