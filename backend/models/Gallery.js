const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    thumbnailUrl: {
        type: String
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['accommodation', 'adventure', 'culture', 'nature', 'food', 'heritage', 'activities', 'textiles', 'events'],
            message: 'Invalid category'
        },
        default: 'nature'
    },
    tags: [{
        type: String,
        trim: true
    }],
    isFeatured: {
        type: Boolean,
        default: false
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    uploadedBy: String,
    metadata: {
        fileSize: Number,
        mimeType: String,
        dimensions: {
            width: Number,
            height: Number
        }
    }
}, {
    timestamps: true
});

// Virtual for image path
gallerySchema.virtual('fullImagePath').get(function() {
    return `${process.env.BACKEND_URL || 'http://localhost:5000'}${this.imageUrl}`;
});

gallerySchema.virtual('fullThumbnailPath').get(function() {
    return this.thumbnailUrl ? 
        `${process.env.BACKEND_URL || 'http://localhost:5000'}${this.thumbnailUrl}` : 
        this.fullImagePath;
});

// Indexes
gallerySchema.index({ category: 1 });
gallerySchema.index({ isFeatured: 1 });
gallerySchema.index({ displayOrder: 1 });
gallerySchema.index({ createdAt: -1 });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;