const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log('Connected to MongoDB');
    await User.deleteOne({ email: 'admin@chanderiecoretreat.com' });
    console.log('Removed old double-hashed admin');
    
    const admin = await User.create({
        name: 'Admin',
        email: 'admin@chanderiecoretreat.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
    });
    console.log('Created new single-hashed admin');
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
