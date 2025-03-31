const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

async function sendResetPasswordEmail(email, token) {
    const resetLink = `http://localhost:5000/reset-password.html?token=${token}`;

    const mailOptions = {
        from: "no-reply@todoapp.com",
        to: email,
        subject: "Скидання пароля",
        html: `<p>Щоб скинути пароль, натисніть на посилання:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>Якщо ви не запитували скидання пароля, просто ігноруйте цей лист.</p>`,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendResetPasswordEmail };
