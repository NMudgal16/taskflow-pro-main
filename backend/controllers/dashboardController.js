const { getDashboardOverview } = require("../services/analyticsService");

const getOverview = async (req, res) => {
  try {
    const overview = await getDashboardOverview(req.user, req.query);
    return res.status(200).json(overview);
  } catch (error) {
    return res.status(500).json({ message: "Could not load dashboard", error: error.message });
  }
};

module.exports = { getOverview };
