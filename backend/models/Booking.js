const mongoose = require('mongoose');
const validator = require('validator');

const bookingSchema = new mongoose.Schema({
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
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: 'Please provide a valid 10-digit phone number'
        }
    },
    checkIn: {
        type: Date,
        required: [true, 'Check-in date is required'],
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Check-in date must be in the future'
        }
    },
    checkOut: {
        type: Date,
        required: [true, 'Check-out date is required'],
        validate: {
            validator: function(value) {
                return value > this.checkIn;
            },
            message: 'Check-out date must be after check-in date'
        }
    },
    guests: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: [1, 'At least 1 guest is required'],
        max: [10, 'Maximum 10 guests allowed']
    },
    tentType: {
        type: String,
        required: [true, 'Tent type is required'],
        enum: {
            values: ['standard', 'deluxe', 'family', 'luxury'],
            message: 'Invalid tent type'
        },
        default: 'standard'
    },
    specialRequests: {
        type: String,
        trim: true,
        maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    extraFeatures: [{
        type: String,
        enum: ['meals', 'safari', 'bonfire', 'guide']
    }],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    bookingReference: {
        type: String,
        unique: true
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    }
}, {
    timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
    if (!this.bookingReference) {
        this.bookingReference = 'CH' + Date.now() + Math.floor(Math.random() * 1000);
    }
    
    // Calculate total amount
    const priceMap = {
        standard: 2999,
        deluxe: 4499,
        family: 6999,
        luxury: 9999
    };
    
    const extraPriceMap = {
        meals: 1500,
        safari: 2500,
        bonfire: 800,
        guide: 1200
    };

    const nights = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
    let baseTotal = nights * priceMap[this.tentType];

    let extraTotal = 0;
    if (this.extraFeatures && this.extraFeatures.length > 0) {
        this.extraFeatures.forEach(feature => {
            if (extraPriceMap[feature]) extraTotal += extraPriceMap[feature];
        });
    }

    this.totalAmount = baseTotal + extraTotal;
    
    next();
});

// Virtual for nights
bookingSchema.virtual('nights').get(function() {
    if (this.checkIn && this.checkOut) {
        return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
    }
    return 0;
});

// Indexes for better performance
bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ checkIn: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;