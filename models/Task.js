const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", TaskSchema);
