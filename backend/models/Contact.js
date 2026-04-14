const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address'
        }
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^[0-9]{10}$/.test(v);
            },
            message: 'Please provide a valid 10-digit phone number'
        }
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        minlength: [5, 'Subject must be at least 5 characters'],
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters'],
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

// Indexes
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;