# 🚀 Rideshare Pro Backend - Modular Express Ecosystem

Rideshare Pro Backend is a high-performance, modularized server-side solution built to handle real-time transportation logistics. It powers the Rideshare mobile ecosystem with secure authentication, live ride-matching, instant messaging, and automated payment verification.

---

## 🏗️ Key Technical Features

*   **Real-Time Synchronization:** Leverages **Socket.IO** for instantaneous updates across the ecosystem.
    *   *Ride Requests:* Instant broadcasting to nearby drivers.
    *   *Live Tracking:* Continuous GPS coordinate transmission.
    *   *Dynamic Availability:* Real-time cache invalidation when drivers go offline.
*   **Secure Payments:** Full integration with **Stripe** for automated payment intent creation and backend transaction verification.
*   **Advanced Data Filtering:** Custom **QueryBuilder** allows for complex searching, multi-field sorting, and dynamic pagination with minimal code.
*   **End-to-End Validation:** Built with **Zod**, ensuring that all incoming data is strictly validated before touching the database.
*   **Role-Based Security:** Granular access control for **Riders, Drivers, and Admins** via a centralized Auth middleware.

---

## 🛠️ Technology Stack
*   **Runtime:** Node.js with Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Validation:** Zod schemas for end-to-end type safety
*   **Real-time:** Socket.IO for persistent bidirectional communication
*   **Security:** Role-Based Access Control (RBAC) ensuring only authorized users can access specific modules.

---

## 📁 Project Structure

This project follows the **Modular Pattern** where every feature (Auth, User, Ride, Chat, etc.) is self-contained with its own Controllers, Routes, Services, and Models.

```text
rideshare-backend/
├── src/
│   ├── app.ts                 # Express application instance & middleware setup
│   ├── main.ts                # Entry point: Server & Socket.io initialization
│   │
│   ├── modules/               # Feature-based Modules (Business Logic)
│   │   ├── auth/              # Authentication & Authorization
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.utils.ts
│   │   │
│   │   ├── user/              # User Profile & Real-time Status
│   │   │   ├── user.model.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.route.ts
│   │   │   ├── user.interface.ts
│   │   │   └── user.validation.ts
│   │   │
│   │   ├── driver/            # Driver Profiles & Licenses
│   │   │   ├── driver.model.ts
│   │   │   ├── driver.controller.ts
│   │   │   ├── driver.service.ts
│   │   │   ├── driver.route.ts
│   │   │   ├── driver.interface.ts
│   │   │   └── driver.validation.ts
│   │   │
│   │   ├── vehicle/           # Vehicle Management & AC Status
│   │   │   ├── vehicle.model.ts
│   │   │   ├── vehicle.controller.ts
│   │   │   ├── vehicle.service.ts
│   │   │   ├── vehicle.route.ts
│   │   │   ├── vehicle.interface.ts
│   │   │   └── vehicle.validation.ts
│   │   │
│   │   ├── ride/              # Ride Request & Matching
│   │   │   ├── ride.model.ts
│   │   │   ├── ride.controller.ts
│   │   │   ├── ride.service.ts
│   │   │   ├── ride.route.ts
│   │   │   ├── ride.interface.ts
│   │   │   ├── ride.validation.ts
│   │   │   └── ride.constant.ts
│   │   │
│   │   ├── chat/              # Real-time Chat & History
│   │   │   ├── chat.model.ts
│   │   │   ├── message.model.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── chat.route.ts
│   │   │   ├── chat.interface.ts
│   │   │   └── chat.socket.ts
│   │   │
│   │   ├── call/              # VoIP & Call Signaling
│   │   │   ├── call.model.ts
│   │   │   ├── call.controller.ts
│   │   │   ├── call.service.ts
│   │   │   ├── call.route.ts
│   │   │   └── call.socket.ts
│   │   │
│   │   ├── complaint/         # User Feedback & Complaints
│   │   │   ├── complaint.model.ts
│   │   │   ├── complaint.controller.ts
│   │   │   ├── complaint.service.ts
│   │   │   ├── complaint.route.ts
│   │   │   └── complaint.interface.ts
│   │   │
│   │   ├── notification/      # Push & Socket Notifications
│   │   │   ├── notification.model.ts
│   │   │   ├── notification.controller.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── notification.route.ts
│   │   │   └── notification.interface.ts
│   │   │
│   │   └── payment/           # Stripe/SSLCommerz Integration
│   │       ├── payment.model.ts
│   │       ├── payment.controller.ts
│   │       ├── payment.service.ts
│   │       ├── payment.route.ts
│   │       └── payment.utils.ts
│   │
│   ├── socket/                # Global Socket.io Configuration
│   │   └── socket.io.ts       
│   │
│   ├── middlewares/           # Custom Express Middlewares
│   │   ├── auth.ts            # JWT verification & role checking
│   │   ├── globalErrorHandler.ts
│   │   ├── validateRequest.ts # Schema validation using Zod/Joi
│   │   └── notFound.ts        # 404 handler
│   │
│   ├── config/                # App Configuration
│   │   ├── index.ts           # Environment variables (dotenv)
│   │   └── cloudinary.ts      # Media upload config
│   │
│   ├── errors/                # Error Handling Classes
│   │   ├── AppError.ts        # Custom Error class
│   │   ├── handleZodError.ts
│   │   └── handleValidationError.ts
│   │
│   ├── utils/                 # Shared Utilities
│   │   ├── catchAsync.ts      # Async wrapper to avoid try-catch blocks
│   │   ├── sendResponse.ts    # Global response formatter
│   │   └── generateToken.ts   # JWT generator
│   │
│   ├── builder/               # Database Helpers
│   │   └── QueryBuilder.ts    # Advanced filtering, sorting & search
│   │
│   └── interface/             # Global TypeScript Interfaces
│       ├── error.ts
│       └── index.d.ts         # Express Request extension (for user)
│
├── .env                       # Secrets (DB_URL, JWT_SECRET, API_KEYS)
├── .gitignore
├── .prettierrc
├── .eslintrc.json
├── tsconfig.json              # TypeScript configuration
├── package.json
├── render.yaml                # Infrastructure as Code for deployment
└── README.md
```

### ✨ Key Highlights of this Structure:
*   **Strict Modularization:** Each folder under `modules/` is independent. If you want to delete the "Chat" feature, you only need to delete the `chat/` folder and its route from `app.ts`.
*   **Scalability:** The `QueryBuilder.ts` and `catchAsync.ts` utilities ensure that your code remains DRY (Don't Repeat Yourself) as you add more features.
*   **Real-time Ready:** The separation of `chat.socket.ts` and `call.socket.ts` keeps your server clean, allowing for complex signaling and messaging logic.
*   **Security:** The `middlewares/auth.ts` handles all authentication, and `validation.ts` files in each module ensure only clean data reaches your database.