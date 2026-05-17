const express = require("express");
const { getOverview, getUsers } = require("../controllers/adminController");
const { isAdmin, verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken, isAdmin);
router.get("/overview", getOverview);
router.get("/users", getUsers);

module.exports = router;
