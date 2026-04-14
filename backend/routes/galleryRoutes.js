const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const galleryController = require('../controllers/galleryController');

// Validation middleware for gallery upload
const validateGallery = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    
    body('category')
        .optional()
        .isIn(['accommodation', 'adventure', 'culture', 'nature', 'food', 'heritage', 'activities', 'textiles', 'events'])
        .withMessage('Invalid category'),
    
    body('tags')
        .optional()
        .isString().withMessage('Tags must be a comma-separated string'),
    
    body('isFeatured')
        .optional()
        .isBoolean().withMessage('isFeatured must be a boolean'),
    
    body('displayOrder')
        .optional()
        .isInt().withMessage('Display order must be an integer')
];

// @route   POST /api/gallery/upload
// @desc    Upload gallery image
// @access  Private
router.post('/upload', validateGallery, galleryController.uploadImage);

// @route   GET /api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', galleryController.getAllGalleryImages);

// @route   GET /api/gallery/featured
// @desc    Get featured images
// @access  Public
router.get('/featured', galleryController.getFeaturedImages);

// @route   GET /api/gallery/categories
// @desc    Get gallery categories
// @access  Public
router.get('/categories', galleryController.getGalleryCategories);

// @route   GET /api/gallery/:id
// @desc    Get gallery image by ID
// @access  Public
router.get('/:id', galleryController.getGalleryImage);

// @route   PUT /api/gallery/:id
// @desc    Update gallery image
// @access  Private
router.put('/:id', validateGallery, galleryController.updateGalleryImage);

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Private
router.delete('/:id', galleryController.deleteGalleryImage);

module.exports = router;