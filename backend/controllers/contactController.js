const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new contact inquiry
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const contactData = {
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        const contact = await Contact.create(contactData);

        // Native Email Dispatch Sequence
        try {
            const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'admin@chanderiecoretreat.com';
            const emailTemplate = `
                <div style="font-family: sans-serif; max-width: 600px;">
                    <h2 style="color: #047857;">New Portal Inquiry!</h2>
                    <p>A new customer has initiated a contact ping across the Eco Retreat interface.</p>
                    <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;">
                        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Name</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${contact.name}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Email</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${contact.email}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Phone</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${contact.phone}</td></tr>
                        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Inquiry</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${contact.message}</td></tr>
                    </table>
                    <br />
                    <a href="http://localhost:3000/admin/login" style="padding: 10px 20px; background: #047857; color: white; border-radius: 6px; text-decoration: none;">View on Admin Panel</a>
                </div>
            `;
            
            await sendEmail({
                email: adminEmail,
                subject: `🚨 Priority Inquiry: ${contact.name}`,
                message: emailTemplate
            });
        } catch (emailError) {
            console.error('Failed firing tracking email hook cleanly:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Thank you for contacting us. We will get back to you soon.',
            data: contact
        });
    } catch (error) {
        console.error('Contact creation error:', error);
        
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
        
        res.status(500).json({
            success: false,
            message: 'Failed to submit contact form',
            error: error.message
        });
    }
};

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Sort
        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        const contacts = await Contact.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Contact.countDocuments(filter);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            count: contacts.length,
            total,
            totalPages,
            currentPage: parseInt(page),
            data: contacts
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts'
        });
    }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact'
        });
    }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
exports.updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['new', 'read', 'replied', 'archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact'
        });
    }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact'
        });
    }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats
// @access  Private/Admin
exports.getContactStats = async (req, res) => {
    try {
        const stats = await Contact.aggregate([
            {
                $group: {
                    _id: null,
                    totalContacts: { $sum: 1 },
                    newContacts: {
                        $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalContacts: 1,
                    newContacts: 1
                }
            }
        ]);

        const statusStats = await Contact.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const monthlyStats = await Contact.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
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
                overview: stats[0] || { totalContacts: 0, newContacts: 0 },
                byStatus: statusStats,
                monthly: monthlyStats
            }
        });
    } catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact statistics'
        });
    }
};