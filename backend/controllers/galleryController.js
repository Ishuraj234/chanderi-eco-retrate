const Gallery = require('../models/Gallery');
const { upload, handleUploadError } = require('../middleware/upload');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// @desc    Upload gallery image
// @route   POST /api/gallery/upload
// @access  Private/Admin
exports.uploadImage = [
    upload.single('image'),
    handleUploadError,
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No image file uploaded'
                });
            }

            // Generate thumbnail
            const thumbnailPath = path.join(
                'uploads',
                'thumbnails',
                `thumb-${req.file.filename}`
            );

            // Ensure thumbnail directory exists
            await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });

            // Create thumbnail using sharp
            await sharp(req.file.path)
                .resize(300, 200, { fit: 'cover' })
                .toFile(thumbnailPath);

            // Get image dimensions
            const metadata = await sharp(req.file.path).metadata();

            const galleryData = {
                title: req.body.title || req.file.originalname,
                description: req.body.description || '',
                imageUrl: `/uploads/${req.file.filename}`,
                thumbnailUrl: `/uploads/thumbnails/thumb-${req.file.filename}`,
                category: req.body.category || 'nature',
                tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
                isFeatured: req.body.isFeatured === 'true',
                displayOrder: parseInt(req.body.displayOrder) || 0,
                uploadedBy: req.body.uploadedBy || 'admin',
                metadata: {
                    fileSize: req.file.size,
                    mimeType: req.file.mimetype,
                    dimensions: {
                        width: metadata.width,
                        height: metadata.height
                    }
                }
            };

            const gallery = await Gallery.create(galleryData);

            res.status(201).json({
                success: true,
                message: 'Image uploaded successfully',
                data: gallery
            });
        } catch (error) {
            console.error('Image upload error:', error);
            
            // Clean up uploaded file if error occurs
            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error('Failed to delete uploaded file:', unlinkError);
                }
            }
            
            res.status(500).json({
                success: false,
                message: 'Failed to upload image',
                error: error.message
            });
        }
    }
];

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
exports.getAllGalleryImages = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            category,
            featured,
            sortBy = 'displayOrder',
            order = 'asc'
        } = req.query;

        // Build filter
        const filter = {};
        if (category) filter.category = category;
        if (featured === 'true') filter.isFeatured = true;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Sort
        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;
        if (sortBy !== 'createdAt') sort.createdAt = -1;

        const images = await Gallery.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Gallery.countDocuments(filter);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            count: images.length,
            total,
            totalPages,
            currentPage: parseInt(page),
            data: images
        });
    } catch (error) {
        console.error('Get gallery images error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch gallery images'
        });
    }
};

// @desc    Get gallery image by ID
// @route   GET /api/gallery/:id
// @access  Public
exports.getGalleryImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.json({
            success: true,
            data: image
        });
    } catch (error) {
        console.error('Get gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch image'
        });
    }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private/Admin
exports.updateGalleryImage = async (req, res) => {
    try {
        const updateData = req.body;
        
        if (updateData.tags && typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
        }

        const image = await Gallery.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.json({
            success: true,
            message: 'Image updated successfully',
            data: image
        });
    } catch (error) {
        console.error('Update gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update image'
        });
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
exports.deleteGalleryImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete image files
        try {
            if (image.imageUrl) {
                const imagePath = path.join(__dirname, '..', image.imageUrl);
                await fs.unlink(imagePath);
            }
            
            if (image.thumbnailUrl) {
                const thumbnailPath = path.join(__dirname, '..', image.thumbnailUrl);
                await fs.unlink(thumbnailPath);
            }
        } catch (fileError) {
            console.error('Failed to delete image files:', fileError);
        }

        // Delete from database
        await Gallery.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Delete gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image'
        });
    }
};

// @desc    Get gallery categories
// @route   GET /api/gallery/categories
// @access  Public
exports.getGalleryCategories = async (req, res) => {
    try {
        const categories = await Gallery.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get gallery categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch gallery categories'
        });
    }
};

// @desc    Get featured images
// @route   GET /api/gallery/featured
// @access  Public
exports.getFeaturedImages = async (req, res) => {
    try {
        const images = await Gallery.find({ isFeatured: true })
            .sort({ displayOrder: 1, createdAt: -1 })
            .limit(8);

        res.json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        console.error('Get featured images error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured images'
        });
    }
};