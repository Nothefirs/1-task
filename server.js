require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const authMiddleware = require("./middleware/authMiddleware");
const cron = require("node-cron");
const Task = require("./models/Task");
const { sendReminderEmail } = require("./services/emailRemaider");

const app = express();
const PORT = process.env.PORT || 5000;

// Налаштування сесії
app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

// Middleware для роботи з JSON
app.use(express.json());

// Підключення до бази даних MongoDB
mongoose
    .connect("mongodb://localhost:27017/todo-app", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Підключено до бази MongoDB"))
    .catch((err) => console.error("Помилка при підключенні до бази", err));

const taskRoutes = require("./routes/taskRoutes"); // Імпортуємо файл з маршрутами
app.use("/tasks", taskRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Головна сторінка
app.get("/", (req, res) => {
    res.send("TODO List API працює! 🚀");
});

// Захищений маршрут для index.html
app.get("/index.html", authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Захищений маршрут для Dashboard.html
app.get("/Dashboard.html", authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Dashboard.html"));
});

// Запуск сервера тільки в режимі, коли не тестуємо
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
}

//автоматична відправка емейла про задачі на сьогодні emailRemaider.js
cron.schedule("42 11 * * *", async () => {
    try {
        console.log("Перевірка задач на сьогодні...");

        const today = new Date().toISOString().split("T")[0];
        console.log(`Поточна дата: ${today}`);

        const tasksForToday = await Task.find({
            dueDate: today,
        });

        console.log(`Знайдено задач на сьогодні: ${tasksForToday.length}`);

        if (tasksForToday.length > 0) {
            tasksForToday.forEach((task) => {
                sendReminderEmail(task);
            });
        } else {
            console.log("На сьогодні немає задач.");
        }
    } catch (error) {
        console.error("Помилка при перевірці задач: ", error);
    }
});

// Експортуємо для тестів
module.exports = app;
