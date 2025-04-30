

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'your-app-password' // ⚠️ Use Gmail App Password
    }
});

module.exports = transporter;
