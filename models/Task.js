const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    dueDate: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ }
});

module.exports = mongoose.model("Task", TaskSchema);