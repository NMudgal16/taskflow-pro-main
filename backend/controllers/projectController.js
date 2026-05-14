const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getProjects = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { members: req.user._id };
    const projects = await Project.find(filter)
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch projects", error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Project name and description are required" });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: []
    });

    const populatedProject = await project.populate([
      { path: "createdBy", select: "name email role" },
      { path: "members", select: "name email role" }
    ]);

    return res.status(201).json(populatedProject);
  } catch (error) {
    return res.status(500).json({ message: "Could not create project", error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    if (!email) {
      return res.status(400).json({ message: "Member email is required" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const member = await User.findOne({ email: email.toLowerCase(), role: "member" });
    if (!member) {
      return res.status(404).json({ message: "Member user with this email was not found" });
    }

    const alreadyMember = project.members.some((memberId) => memberId.equals(member._id));
    if (!alreadyMember) {
      project.members.push(member._id);
      await project.save();
    }

    const populatedProject = await project.populate([
      { path: "createdBy", select: "name email role" },
      { path: "members", select: "name email role" }
    ]);

    return res.status(200).json(populatedProject);
  } catch (error) {
    return res.status(500).json({ message: "Could not add member", error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    if (!isValidId(id) || !isValidId(memberId)) {
      return res.status(400).json({ message: "Invalid project or member id" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const activeAssignedTasks = await Task.countDocuments({
      project: id,
      assignedTo: memberId,
      status: { $ne: "Done" }
    });

    if (activeAssignedTasks > 0) {
      return res.status(400).json({
        message: "Cannot remove a member with active tasks in this project"
      });
    }

    project.members = project.members.filter((member) => !member.equals(memberId));
    await project.save();

    const populatedProject = await project.populate([
      { path: "createdBy", select: "name email role" },
      { path: "members", select: "name email role" }
    ]);

    return res.status(200).json(populatedProject);
  } catch (error) {
    return res.status(500).json({ message: "Could not remove member", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const activeTasks = await Task.countDocuments({
      project: id,
      status: { $ne: "Done" }
    });

    if (activeTasks > 0) {
      return res.status(400).json({
        message: "Cannot delete a project with active tasks. Complete or delete active tasks first."
      });
    }

    await Task.deleteMany({ project: id });
    await project.deleteOne();

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete project", error: error.message });
  }
};

module.exports = { getProjects, createProject, addMember, removeMember, deleteProject };
