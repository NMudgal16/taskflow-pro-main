const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
    maxlength: 160
  },
  description: {
    type: String,
    required: [true, "Task description is required"],
    trim: true,
    maxlength: 1500
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true
  },
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done", "Overdue"],
    default: "Todo"
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);
