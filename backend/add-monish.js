const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if Monish exists
    const existing = await User.findOne({ email: 'Monish@gmail.com' });
    if (existing) {
        await User.deleteOne({ email: 'Monish@gmail.com' });
        console.log('Removed old Monish account');
    }
    
    await User.create({
        name: 'Monish',
        email: 'Monish@gmail.com',
        password: 'password123',
        role: 'admin',
        isActive: true
    });
    console.log('Created admin account for Monish@gmail.com with password: password123');
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
