const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Отримати всі задачі
router.get("/", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

//Додати нову задачу
router.post("/", async (req, res) => {
    try {
        const { name, description, dueDate } = req.body;
        const newTask = new Task({ name, description, dueDate });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: "Помилка створення задачі" });
    }
});

// Редагувати задачу
router.put("/:id", async (req, res) => {
    try {
        const { name, description, completed, dueDate } = req.body;
        
        // Оновлення задачі з урахуванням dueDate
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { name, description, completed, dueDate },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Задача не знайдена" });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: "Помилка при редагуванні задачі" });
    }
});

// Видалити задачу
router.delete("/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});



module.exports = router;
