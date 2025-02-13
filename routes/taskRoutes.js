const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Отримати всі задачі
router.get("/", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Додати нову задачу
router.post("/", async (req, res) => {
    const { name, description } = req.body;
    const newTask = new Task({ name, description });    
    await newTask.save();
    res.json(newTask);
});

// Редагувати задачу
router.put("/:id", async (req, res) => {
    const { name, description, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { name, description, completed }, { new: true });
    res.json(updatedTask);
});

// Видалити задачу
router.delete("/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});



module.exports = router;
