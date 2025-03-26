require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;


// Налаштування сесії
app.use(session({
  secret: 'your_secret_key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Middleware для роботи з JSON
app.use(express.json());

// Підключення до бази даних MongoDB
mongoose.connect("mongodb://localhost:27017/todo-app", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Підключено до бази MongoDB"))
    .catch((err) => console.error("Помилка при підключенні до бази", err));

const taskRoutes = require("./routes/taskRoutes"); // Імпортуємо файл з маршрутами
app.use("/tasks", taskRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Головна сторінка
app.get('/', (req, res) => {
  res.send('TODO List API працює! 🚀');
});

// Захищений маршрут для index.html
app.get('/index.html', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});




// Запуск сервера тільки в режимі, коли не тестуємо
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
  });
}





// Експортуємо для тестів 
module.exports = app;
