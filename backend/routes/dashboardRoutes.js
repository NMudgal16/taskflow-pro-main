const express = require("express");
const { getOverview } = require("../controllers/dashboardController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);
router.get("/overview", getOverview);

module.exports = router;
