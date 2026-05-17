const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const statuses = ["Todo", "In Progress", "Done", "Overdue"];
const priorities = ["Low", "Medium", "High"];

const refreshOverdueTasks = async () => {
  await Task.updateMany(
    { dueDate: { $lt: new Date() }, status: { $nin: ["Done", "Overdue"] } },
    { $set: { status: "Overdue" } }
  );
};

const populateTask = (query) => query
  .populate("project", "name description members")
  .populate("assignedTo", "name email role")
  .populate("createdBy", "name email role");

const getTasks = async (req, res) => {
  try {
    await refreshOverdueTasks();

    const filter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.project) filter.project = req.query.project;

    const tasks = await populateTask(Task.find(filter)).sort({ dueDate: 1, createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch tasks", error: error.message });
  }
};

const parseDueDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const isUserOnProject = (project, userId) =>
  project.members.some((memberId) => String(memberId) === String(userId));

const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, status, dueDate } = req.body;

    if (!title?.trim() || !description?.trim() || !project || !assignedTo || !priority || !status || !dueDate) {
      return res.status(400).json({
        message: "Title, description, project, assignee, priority, status, and due date are required",
      });
    }

    if (!isValidId(project) || !isValidId(assignedTo)) {
      return res.status(400).json({ message: "Invalid project or assignee id" });
    }

    if (!priorities.includes(priority) || !statuses.includes(status)) {
      return res.status(400).json({ message: "Invalid priority or status value" });
    }

    const parsedDueDate = parseDueDate(dueDate);
    if (!parsedDueDate) {
      return res.status(400).json({ message: "Invalid due date" });
    }

    const targetProject = await Project.findById(project);
    if (!targetProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      return res.status(404).json({ message: "Assignee user was not found" });
    }

    if (assignee.role !== "member") {
      return res.status(400).json({
        message: "Tasks must be assigned to a member account.",
      });
    }

    const assigneeOnProject = isUserOnProject(targetProject, assignedTo);

    if (req.user.role === "member") {
      if (!isUserOnProject(targetProject, req.user._id)) {
        return res.status(403).json({
          message: "You can only create tasks in projects you belong to. Ask an admin to add you to the project.",
        });
      }

      if (!assigneeOnProject) {
        return res.status(400).json({
          message: "Assignee must already be a member of this project.",
        });
      }
    } else if (!assigneeOnProject) {
      targetProject.members.push(assignee._id);
      await targetProject.save();
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      project,
      assignedTo,
      priority,
      status,
      dueDate: parsedDueDate,
      createdBy: req.user._id,
    });

    await refreshOverdueTasks();
    const populatedTask = await populateTask(Task.findById(task._id));
    return res.status(201).json(populatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Could not create task", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssignedMember = req.user.role === "member" && task.assignedTo.equals(req.user._id);
    if (req.user.role !== "admin" && !isAssignedMember) {
      return res.status(403).json({ message: "You can only update tasks assigned to you" });
    }

    if (req.user.role === "member") {
      const { status } = req.body;
      if (!status || !statuses.includes(status)) {
        return res.status(400).json({ message: "A valid status is required" });
      }
      task.status = status;
    } else {
      const allowedFields = ["title", "description", "priority", "status", "dueDate"];
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) task[field] = req.body[field];
      });

      if (req.body.assignedTo !== undefined) {
        if (!isValidId(req.body.assignedTo)) {
          return res.status(400).json({ message: "Invalid assignee id" });
        }

        const targetProject = await Project.findById(task.project);
        const isProjectMember = targetProject.members.some((memberId) => memberId.equals(req.body.assignedTo));
        if (!isProjectMember) {
          return res.status(400).json({ message: "Cannot assign task to a user who is not in the project" });
        }
        task.assignedTo = req.body.assignedTo;
      }

      if (task.priority && !priorities.includes(task.priority)) {
        return res.status(400).json({ message: "Invalid priority value" });
      }

      if (task.status && !statuses.includes(task.status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
    }

    await task.save();
    await refreshOverdueTasks();

    const populatedTask = await populateTask(Task.findById(id));
    return res.status(200).json(populatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Could not update task", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete task", error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
