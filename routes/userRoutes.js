const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const { sendResetPasswordEmail } = require("../services/emailService");
const crypto = require("crypto");

// Реєстрація користувача
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Користувач з таким email вже існує" });
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Користувача зареєстровано успішно" });
});









// Маршрут для входу
router.post('/login', async (req, res) => {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Користувача з таким email не знайдено" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Невірний пароль" });
    }

    // Збереження користувача в сесії
    req.session.userId = user._id;
    req.session.username = user.username;

    // Відправка відповіді з перенаправленням на index.html
    res.json({ message: "Вхід успішний", user: { username: user.username, email: user.email } });
});

// Маршрут для перевірки статусу сесії
router.get('/status', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, user: { username: req.session.username } });
    } else {
        res.json({ loggedIn: false });
    }
});

// Вихід з сесії
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Помилка при виході" });
        }
        res.json({ message: "Вихід успішний" });
    });
});










// Запит на скидання пароля 
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    // Оновлюємо токен і строк дії
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 година

    await user.save();

    await sendResetPasswordEmail(email, resetToken);

    res.json({ message: "Лист з інструкціями надіслано на пошту" });
});

// Скидання пароля
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    // Знайти користувача за токеном
    const user = await User.findOne({ resetPasswordToken: token });

    // Логування для перевірки
    console.log('Отриманий токен з фронтенду:', token);


    if (!user) {
        return res.status(400).json({ message: "Невірний токен" });
    }

    // Перевірка на термін дії токена
    if (user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: "Токен прострочений" });
    }

    // Хешування нового пароля
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Оновлення пароля
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Очищаємо токен
    user.resetPasswordExpires = undefined; // Очищаємо термін дії токена

    await user.save();

    res.json({ message: "Пароль успішно змінено" });
});








module.exports = router;





