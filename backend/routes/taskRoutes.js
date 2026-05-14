const express = require("express");
const { createTask, deleteTask, getTasks, updateTask } = require("../controllers/taskController");
const { isAdmin, verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);
router.get("/", getTasks);
router.post("/", isAdmin, createTask);
router.put("/:id", updateTask);
router.delete("/:id", isAdmin, deleteTask);

module.exports = router;
