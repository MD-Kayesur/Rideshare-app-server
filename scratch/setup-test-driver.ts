import mongoose from 'mongoose';
import { User } from '../src/modules/user/user.model';
import { Driver } from '../src/modules/driver/driver.model';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/rideshare';

async function setupDriver() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB');

        // Find Kayesur Boss
        const user = await User.findOneAndUpdate(
            { email: 'mdkayesurrahman@gmail.com' },
            { isOnline: true },
            { new: true }
        );

        if (user) {
            console.log(`Driver ${user.name} is now ONLINE`);
            
            const driver = await Driver.findOneAndUpdate(
                { user: user._id },
                { isVerified: true, isAvailable: true },
                { new: true }
            );
            
            if (driver) {
                console.log(`Driver profile for ${user.name} is now VERIFIED and AVAILABLE`);
            }
        } else {
            console.log('Driver not found');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

setupDriver();
