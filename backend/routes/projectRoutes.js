const express = require("express");
const { addMember, createProject, deleteProject, getProjects, removeMember } = require("../controllers/projectController");
const { isAdmin, verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);
router.get("/", getProjects);
router.post("/", isAdmin, createProject);
router.delete("/:id", isAdmin, deleteProject);
router.post("/:id/members", isAdmin, addMember);
router.delete("/:id/members/:memberId", isAdmin, removeMember);

module.exports = router;
