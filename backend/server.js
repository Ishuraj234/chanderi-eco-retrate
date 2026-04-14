const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Import routes
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const authRoutes = require('./routes/authRoutes');  // ← MUST HAVE THIS

const app = express();

// Middleware
app.options('*', cors());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://chanderi-eco-retrate.onrender.com',
    'https://chanderi-eco-retrate-1.onrender.com',
    'https://eco-resort.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
});

// ========== ROUTES SECTION ==========
console.log('📡 Registering routes...');

app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/auth', authRoutes);  // ← THIS IS CRITICAL

console.log('✅ Routes registered:');
console.log('   - /api/bookings');
console.log('   - /api/contact');
console.log('   - /api/gallery');
console.log('   - /api/auth');
// ====================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Test: http://localhost:${PORT}/api/health`);
    console.log(`🔗 Auth test: http://localhost:${PORT}/api/auth/test`);
});