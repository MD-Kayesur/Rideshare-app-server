import mongoose from 'mongoose';
import { User } from '../src/modules/user/user.model';
import { Driver } from '../src/modules/driver/driver.model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/rideshare';

async function checkDrivers() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');

        await User.findOne(); // Ensure model registration
        const drivers = await Driver.find().populate('user');
        console.log(`Found ${drivers.length} drivers`);

        drivers.forEach((d: any) => {
            console.log('---');
            console.log(`Name: ${d.user?.name}`);
            console.log(`Email: ${d.user?.email}`);
            console.log(`Role: ${d.user?.role}`);
            console.log(`Online: ${d.user?.isOnline}`);
            console.log(`Verified: ${d.isVerified}`);
            console.log(`Vehicle: ${d.vehicleType}`);
            console.log(`Location: ${JSON.stringify(d.user?.currentLocation)}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkDrivers();
