"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const ride_route_1 = require("../modules/ride/ride.route");
const chat_route_1 = require("../modules/chat/chat.route");
const call_route_1 = require("../modules/call/call.route");
const payment_route_1 = require("../modules/payment/payment.route");
const driver_route_1 = require("../modules/driver/driver.route");
const complaint_route_1 = require("../modules/complaint/complaint.route");
const notification_route_1 = require("../modules/notification/notification.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/rides',
        route: ride_route_1.RideRoutes,
    },
    {
        path: '/chats',
        route: chat_route_1.ChatRoutes,
    },
    {
        path: '/calls',
        route: call_route_1.CallRoutes,
    },
    {
        path: '/payments',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/drivers',
        route: driver_route_1.DriverRoutes,
    },
    {
        path: '/complaints',
        route: complaint_route_1.ComplaintRoutes,
    },
    {
        path: '/notifications',
        route: notification_route_1.NotificationRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
