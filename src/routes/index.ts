import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { RideRoutes } from '../modules/ride/ride.route';
import { ChatRoutes } from '../modules/chat/chat.route';
import { CallRoutes } from '../modules/call/call.route';
import { PaymentRoutes } from '../modules/payment/payment.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/rides',
    route: RideRoutes,
  },
  {
    path: '/chats',
    route: ChatRoutes,
  },
  {
    path: '/calls',
    route: CallRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
