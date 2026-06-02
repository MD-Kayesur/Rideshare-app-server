import mongoose from 'mongoose';
import app from '../src/app';
import config from '../src/config';

// Ensure MongoDB connects when Vercel spins up the serverless function.
// Mongoose will buffer any database operations until the connection is established.
if (!mongoose.connections[0].readyState) {
  mongoose.connect(config.database_url as string)
    .then(() => console.log('Successfully connected to MongoDB on Vercel'))
    .catch((err) => console.error('MongoDB connection error on Vercel:', err));
}

// Export the Express app so Vercel can handle HTTP requests
export default app;
