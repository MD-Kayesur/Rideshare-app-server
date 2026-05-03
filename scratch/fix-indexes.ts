import mongoose from 'mongoose';
import { User } from '../src/modules/user/user.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.DATABASE_URL;

async function fixIndexes() {
  if (!MONGO_URI) {
    console.error('DATABASE_URL not found in .env');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Clean up invalid currentLocation data
    // MongoDB's 2dsphere index requires coordinates to be [lng, lat]
    // and currentLocation.type must be 'Point'
    const invalidUsers = await User.find({
      $or: [
        { 'currentLocation': { $exists: false } },
        { 'currentLocation.coordinates': { $exists: false } },
        { 'currentLocation.coordinates': { $size: 0 } },
        { 'currentLocation.coordinates': { $size: 1 } },
        { 'currentLocation.type': { $ne: 'Point' } }
      ]
    });

    console.log(`Found ${invalidUsers.length} invalid location documents`);

    for (const u of invalidUsers) {
        console.log(`Fixing user: ${u.email}`);
        await User.findByIdAndUpdate(u._id, {
            $set: {
                currentLocation: {
                    type: 'Point',
                    coordinates: [90.4125, 23.8103] // Default to Dhaka
                }
            }
        });
    }

    // 2. Force index creation
    console.log('Syncing indexes...');
    await User.syncIndexes();
    console.log('Indexes synced successfully');

    const indexes = await User.collection.getIndexes();
    console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixIndexes();
