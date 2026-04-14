const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');

// Standardized fallback config for developer testing instances
const KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_1234567890';

// Initialize Native Razorpay Sandbox Gateway
const razorpay = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

// 1. Create Transaction Order Token
router.post('/create-order', async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking reference explicitly not found' });
        }

        const options = {
            amount: booking.totalAmount * 100, // Denominations explicitly handled in smallest physical currency (paise)
            currency: 'INR',
            receipt: `receipt_${booking._id}`,
        };

        const order = await razorpay.orders.create(options);
        
        // Save initial transaction state tracking into MongoDB 
        booking.razorpayOrderId = order.id;
        await booking.save({ validateModifiedOnly: true });

        res.json({ success: true, order, keyId: KEY_ID });
    } catch (error) {
        console.error('Razorpay Create Order Logic Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create payment order pipeline token', error: error.message });
    }
});

// 2. Validate/Verify Gateway Pushes Securely Using Cryptography 
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        // Implement SHA256 HMAC cryptographic signature hashing
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Webhook payload matched! Payment genuinely cleared.
            const booking = await Booking.findById(bookingId);
            if (booking) {
                // Update final tracking values safely
                booking.paymentStatus = 'paid';
                booking.razorpayPaymentId = razorpay_payment_id;
                booking.razorpaySignature = razorpay_signature;
                await booking.save({ validateModifiedOnly: true });
            }
            return res.json({ success: true, message: 'Payment mapped inherently and formally verified.' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid or forged cryptographic signature payload! Rejecting immediately.' });
        }
    } catch (error) {
        console.error('Razorpay Decryption/Verification Error:', error);
        res.status(500).json({ success: false, message: 'Payment processing decryption failure.', error: error.message });
    }
});

module.exports = router;
