const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');

// Validation middleware
const validateContact = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
    
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 5 }).withMessage('Subject must be at least 5 characters'),
    
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
        .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];

// @route   POST /api/contact
// @desc    Create new contact inquiry
// @access  Public
router.post('/', validateContact, contactController.createContact);

// @route   GET /api/contact
// @desc    Get all contacts (Admin only)
// @access  Private
router.get('/', contactController.getAllContacts);

// @route   GET /api/contact/stats
// @desc    Get contact statistics
// @access  Private
router.get('/stats', contactController.getContactStats);

// @route   GET /api/contact/:id
// @desc    Get single contact
// @access  Private
router.get('/:id', contactController.getContact);

// @route   PUT /api/contact/:id/status
// @desc    Update contact status
// @access  Private
router.put('/:id/status', 
    body('status').isIn(['new', 'read', 'replied', 'archived']),
    contactController.updateContactStatus
);

// @route   DELETE /api/contact/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', contactController.deleteContact);

module.exports = router;