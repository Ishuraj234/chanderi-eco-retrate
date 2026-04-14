const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const bookingData = req.body;
        
        const booking = await Booking.create(bookingData);

        // Map live email alerts immediately onto the dashboard 
        try {
            const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'admin@chanderiecoretreat.com';
            const extraTags = booking.extraFeatures?.length ? booking.extraFeatures.join(', ') : 'None';
            
            const bookingHtml = `
                <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
                    <div style="text-align: center; border-bottom: 2px solid #047857; padding-bottom: 10px;">
                        <h2 style="color: #047857; margin-bottom: 5px;">🔥 New Booking Acquired!</h2>
                        <span style="color: grey;">Ref: ${booking.bookingReference}</span>
                    </div>
                    <div style="padding: 20px 0;">
                        <p><strong>Customer Name:</strong> ${booking.name}</p>
                        <p><strong>Contact Points:</strong> ${booking.phone} / ${booking.email}</p>
                        <br/>
                        <p><strong>Accommodations:</strong> ${booking.tentType.toUpperCase()} Tent (${booking.guests} Guests)</p>
                        <p><strong>Dates:</strong> ${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()}</p>
                        <p><strong>Requested Add-ons:</strong> ${extraTags}</p>
                        <br/>
                        <h3 style="color: #047857; border-top: 1px dotted grey; padding-top: 10px;">Total Financial Output: ₹${booking.totalAmount.toLocaleString('en-IN')}</h3>
                        <p style="color: salmon; font-size: 0.9em;">Payment Status: <strong>${booking.paymentStatus}</strong></p>
                    </div>
                    <a href="http://localhost:3000/admin/login" style="display: block; width: 100%; text-align: center; padding: 12px; background: #047857; color: white; border-radius: 8px; text-decoration: none;">Launch Dashboard Analytics</a>
                </div>
            `;
            
            await sendEmail({
                email: adminEmail,
                subject: `✅ Booking Checked Out: ${booking.name} - ₹${booking.totalAmount.toLocaleString('en-IN')}`,
                message: bookingHtml
            });

            // Dispatch secondary Email explicitly validating to the user inherently.
            const userHtml = `
                <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
                    <div style="text-align: center; border-bottom: 2px solid #047857; padding-bottom: 10px;">
                        <h2 style="color: #047857; margin-bottom: 5px;">Thank You for Booking with Chanderi Eco Retreat!</h2>
                        <span style="color: grey;">Booking Reference: ${booking.bookingReference}</span>
                    </div>
                    <div style="padding: 20px 0;">
                        <p>Dear <strong>${booking.name}</strong>,</p>
                        <p>Your booking has been successfully received. We are incredibly excited to host you!</p>
                        <br/>
                        <p><strong>Accommodations:</strong> ${booking.tentType.toUpperCase()} Tent (${booking.guests} Guests)</p>
                        <p><strong>Dates:</strong> ${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()}</p>
                        <p><strong>Requested Add-ons:</strong> ${extraTags}</p>
                        <br/>
                        <h3 style="color: #047857; border-top: 1px dotted grey; padding-top: 10px;">Total Amount: ₹${booking.totalAmount.toLocaleString('en-IN')}</h3>
                        <p>We will contact you shortly regarding the next steps.</p>
                    </div>
                    <div style="text-align: center; padding-top: 20px; color: grey; font-size: 0.8em;">
                        Chanderi Eco Retreat - Adventure & Heritage
                    </div>
                </div>
            `;
            
            await sendEmail({
                email: booking.email,
                subject: `Booking Confirmation: Chanderi Eco Retreat (${booking.bookingReference})`,
                message: userHtml
            });
        } catch (emailError) {
            console.error('Failed triggering primary Booking SMTP handler natively:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                booking,
                bookingReference: booking.bookingReference,
                totalAmount: booking.totalAmount
            }
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate booking reference'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message
        });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            tentType,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (tentType) filter.tentType = tentType;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Sort
        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        const bookings = await Booking.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Booking.countDocuments(filter);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            count: bookings.length,
            total,
            totalPages,
            currentPage: parseInt(page),
            data: bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings'
        });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private/Admin
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking'
        });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Send status update email (in production)
        // await sendStatusUpdateEmail(booking);

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking'
        });
    }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete booking'
        });
    }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private/Admin
exports.getBookingStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalBookings: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    avgBookingValue: { $avg: '$totalAmount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalBookings: 1,
                    totalRevenue: 1,
                    avgBookingValue: { $round: ['$avgBookingValue', 2] }
                }
            }
        ]);

        const statusStats = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        const tentTypeStats = await Booking.aggregate([
            {
                $group: {
                    _id: '$tentType',
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        const monthlyStats = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }
            },
            {
                $limit: 6
            }
        ]);

        res.json({
            success: true,
            data: {
                overview: stats[0] || { totalBookings: 0, totalRevenue: 0, avgBookingValue: 0 },
                byStatus: statusStats,
                byTentType: tentTypeStats,
                monthly: monthlyStats
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
};