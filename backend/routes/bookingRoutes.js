const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bookingController = require('../controllers/bookingController');

// Validation middleware
const validateBooking = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
    
    body('checkIn')
        .notEmpty().withMessage('Check-in date is required')
        .isISO8601().withMessage('Invalid date format')
        .custom((value, { req }) => {
            const checkInDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return checkInDate > today;
        }).withMessage('Check-in date must be in the future'),
    
    body('checkOut')
        .notEmpty().withMessage('Check-out date is required')
        .isISO8601().withMessage('Invalid date format')
        .custom((value, { req }) => {
            const checkOutDate = new Date(value);
            const checkInDate = new Date(req.body.checkIn);
            return checkOutDate > checkInDate;
        }).withMessage('Check-out date must be after check-in date'),
    
    body('guests')
        .notEmpty().withMessage('Number of guests is required')
        .isInt({ min: 1, max: 10 }).withMessage('Guests must be between 1 and 10'),
    
    body('tentType')
        .isIn(['standard', 'deluxe', 'family', 'luxury'])
        .withMessage('Invalid tent type'),
    
    body('specialRequests')
        .optional()
        .isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters')
];

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Public
router.post('/', validateBooking, bookingController.createBooking);

// @route   GET /api/bookings
// @desc    Get all bookings (Admin only)
// @access  Private
router.get('/', bookingController.getAllBookings);

// @route   GET /api/bookings/stats
// @desc    Get booking statistics
// @access  Private
router.get('/stats', bookingController.getBookingStats);

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', bookingController.getBooking);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', 
    body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']),
    bookingController.updateBookingStatus
);

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;