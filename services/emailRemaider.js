const nodemailer = require('nodemailer');

// Налаштування транспорту для відправки email через Mailtrap
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

// Функція для відправки email
const sendReminderEmail = async (task) => {
    const mailOptions = {
        from: "no-reply@todoapp.com",
        to: 'dan.namba.van.1@gmail.com',
        subject: 'Нагадування про задачу на сьогодні',
        text: `Не забудьте про задачу: ${task.name}\nОпис: ${task.description}\nДата виконання: ${task.dueDate}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Нагадування надіслано: ' + info.response);
    } catch (error) {
        console.log('Помилка при відправці email:', error);
    }
};

module.exports = { sendReminderEmail };