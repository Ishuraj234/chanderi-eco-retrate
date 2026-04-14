const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create an explicit SMTP transporter securely mapping across ENV bindings natively.
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `Chanderi Eco Retreat Alerts <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    // Safely execute mail logic without blocking sequences if the server misses env variables natively.
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Nodemailer Alert Fired: ${options.subject}`);
    } else {
        console.log('⚠️ Alert not dispatched: SMTP credentials missing natively in .env parameters.');
        console.log(`Fallback Hook [To: ${options.email}] [Subject: ${options.subject}]`);
    }
};

module.exports = sendEmail;
