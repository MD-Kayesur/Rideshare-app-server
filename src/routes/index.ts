import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { RideRoutes } from '../modules/ride/ride.route';
import { ChatRoutes } from '../modules/chat/chat.route';
import { CallRoutes } from '../modules/call/call.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { DriverRoutes } from '../modules/driver/driver.route';
import { ComplaintRoutes } from '../modules/complaint/complaint.route';
import { NotificationRoutes } from '../modules/notification/notification.route';
import { VehicleRoutes } from '../modules/vehicle/vehicle.route';
import { WalletRoutes } from '../modules/wallet/wallet.route';

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
  {
    path: '/drivers',
    route: DriverRoutes,
  },
  {
    path: '/complaints',
    route: ComplaintRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/vehicles',
    route: VehicleRoutes,
  },
  {
    path: '/wallet',
    route: WalletRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
