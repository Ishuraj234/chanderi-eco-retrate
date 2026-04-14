const express = require('express');
const router = express.Router();

// Test route - GET
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Auth routes are working!' 
    });
});

// Setup route - GET (browser ke liye GET use karo)
router.get('/setup', async (req, res) => {
    try {
        console.log('🔧 Setup admin called...');
        
        const User = require('../models/User');
        const bcrypt = require('bcryptjs');
        
        // Check if admin exists
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            return res.json({
                success: true,
                message: 'Admin already exists',
                admin: {
                    email: adminExists.email,
                    name: adminExists.name
                }
            });
        }
        
        // Create admin
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@chanderiecoretreat.com',
            password: 'admin123',
            role: 'admin',
            isActive: true
        });
        
        console.log('✅ Admin created:', admin.email);
        
        res.json({
            success: true,
            message: 'Admin user created successfully',
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create admin',
            error: error.message
        });
    }
});

// Login route - POST
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('📨 Admin Login attempt:', email);
        
        const User = require('../models/User');
        const bcrypt = require('bcryptjs');
        const jwt = require('jsonwebtoken');
        
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
                
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }
        
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'mysecretkey123',
            { expiresIn: '30d' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Normal User Login Route
router.post('/user-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const User = require('../models/User');
        const jwt = require('jsonwebtoken');
        
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'mysecretkey123', { expiresIn: '30d' });
        
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

// Admin Register Route
router.post('/admin-register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const User = require('../models/User');
        const jwt = require('jsonwebtoken');
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        user = await User.create({ name, email, password, role: 'admin', isActive: true });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'mysecretkey123', { expiresIn: '30d' });
        
        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Admin Registration failed', error: error.message });
    }
});

// Register route - POST
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const User = require('../models/User');
        const jwt = require('jsonwebtoken');
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        user = await User.create({ name, email, password, role: 'user', isActive: true });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'mysecretkey123', { expiresIn: '30d' });
        
        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
});

module.exports = router;