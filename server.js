require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для роботи з JSON
app.use(express.json());

// Підключення до бази даних MongoDB
mongoose.connect("mongodb://localhost:27017/todo-app", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Підключено до бази MongoDB"))
    .catch((err) => console.error("Помилка при підключенні до бази", err));

// Маршрути
const taskRoutes = require("./routes/taskRoutes"); // Імпортуємо файл з маршрутами
app.use("/tasks", taskRoutes); // Підключаємо маршрути до /tasks

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Головна сторінка
app.get('/', (req, res) => {
  res.send('TODO List API працює! 🚀');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});
