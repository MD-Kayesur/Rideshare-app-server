import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { initializeSocket } from './socket/socket.io';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Successfully connected to MongoDB');

    server = app.listen(config.port, () => {
      console.log(`Application is running on port ${config.port}`);
    });

    // Initialize Socket.io
    initializeSocket(server);

  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection detected, shutting down server...');
  console.error(error); // Added error logging
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception detected, shutting down...');
  console.error(error); // Added error logging
  process.exit(1);
});
