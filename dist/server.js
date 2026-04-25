"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const socket_io_1 = require("./socket/socket.io");
let server;
async function main() {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        console.log('Successfully connected to MongoDB');
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`Application is running on port ${config_1.default.port}`);
        });
        // Initialize Socket.io
        (0, socket_io_1.initializeSocket)(server);
    }
    catch (err) {
        console.log(err);
    }
}
main();
process.on('unhandledRejection', (error) => {
    console.log('Unhandled Rejection detected, shutting down server...');
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on('uncaughtException', () => {
    console.log('Uncaught Exception detected, shutting down...');
    process.exit(1);
});
